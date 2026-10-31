import nodemailer from "nodemailer";

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char] ?? char,
  );

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const smtpUser = process.env.GMAIL_SMTP_USER;
  const smtpPassword = process.env.GMAIL_SMTP_APP_PASSWORD;
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!smtpUser || !smtpPassword || !supabaseUrl || !supabaseKey) {
    return res.status(503).json({
      error:
        "Email delivery is not configured yet. Please contact us by phone or WhatsApp.",
    });
  }

  const payload = req.body;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ error: "Invalid request body." });
  }
  const body = payload as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 60) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";

  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({
      error: "Please provide your name, message, and an email or phone number.",
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "The email address you entered is invalid." });
  }

  let recipient = "";
  try {
    const baseUrl = supabaseUrl.replace(/\/$/, "");
    const settingsResponse = await fetch(
      `${baseUrl}/rest/v1/site_settings?id=eq.true&select=email`,
      {
        headers: {
          apikey: supabaseKey,
          authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!settingsResponse.ok) {
      return res.status(502).json({
        error: "We couldn't load the enquiry destination. Please try again later.",
      });
    }

    const settings = (await settingsResponse.json()) as Array<{
      email?: string | null;
    }>;
    recipient =
      settings[0]?.email?.trim() || process.env.CONTACT_EMAIL?.trim() || "";
  } catch {
    return res.status(502).json({
      error: "We couldn't load the enquiry destination. Please try again later.",
    });
  }

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return res.status(503).json({
      error: "Please configure a valid enquiry email in Admin → Settings.",
    });
  }
  if (smtpUser.toLowerCase() !== "agragrotech@gmail.com") {
    return res.status(503).json({
      error: "Please configure the approved website sending account.",
    });
  }

  const html = [
    "<h2>New Fruitly website enquiry</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Customer email:</strong> ${escapeHtml(email || "Not provided")}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPassword.replace(/\s/g, ""),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: `Fruitly Website <${smtpUser}>`,
      to: recipient,
      replyTo: email || undefined,
      subject: `Fruitly website enquiry from ${name}`,
      text: [
        "New Fruitly website enquiry",
        `Name: ${name}`,
        `Customer email: ${email || "Not provided"}`,
        `Phone: ${phone || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html,
    });

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({
      error: "We couldn't send your enquiry right now. Please try again or contact us by phone or WhatsApp.",
    });
  }
}
