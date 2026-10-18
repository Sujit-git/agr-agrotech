import nodemailer from "nodemailer";

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

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

export default async (request: Request) => {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
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
    return json(503, {
      error:
        "Email delivery is not configured yet. Please contact us by phone or WhatsApp.",
    });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json(400, { error: "Invalid request body." });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  const name =
    typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
  const email =
    typeof payload.email === "string"
      ? payload.email.trim().slice(0, 254)
      : "";
  const phone =
    typeof payload.phone === "string" ? payload.phone.trim().slice(0, 60) : "";
  const message =
    typeof payload.message === "string"
      ? payload.message.trim().slice(0, 5000)
      : "";

  if (!name || !message || (!email && !phone)) {
    return json(400, {
      error:
        "Please provide your name, message, and an email or phone number.",
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "The email address you entered is invalid." });
  }

  // Read the destination from the existing Admin → Settings email field.
  // Do not accept recipient addresses from browser input.
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
      return json(502, {
        error:
          "We couldn't load the enquiry destination. Please try again later.",
      });
    }

    const settings = (await settingsResponse.json()) as Array<{
      email?: string | null;
    }>;
    recipient =
      settings[0]?.email?.trim() || process.env.CONTACT_EMAIL?.trim() || "";
  } catch {
    return json(502, {
      error: "We couldn't load the enquiry destination. Please try again later.",
    });
  }

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return json(503, {
      error: "Please configure a valid enquiry email in Admin → Settings.",
    });
  }
  if (smtpUser.toLowerCase() !== "agragrotech@gmail.com") {
    return json(503, {
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

    return json(200, { ok: true });
  } catch {
    return json(502, {
      error:
        "We couldn't send your enquiry right now. Please try again or contact us by phone or WhatsApp.",
    });
  }
};

export const config = {
  path: "/.netlify/functions/send-enquiry",
};
