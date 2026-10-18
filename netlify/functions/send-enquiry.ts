const json = (statusCode: number, body: Record<string, unknown>) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);

export default async (request, _context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json", allow: "POST" },
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!resendApiKey || !fromEmail || !supabaseUrl || !supabaseKey) {
    return json(503, { error: "Email delivery is not configured yet." });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";
  const email = typeof payload.email === "string" ? payload.email.trim().slice(0, 254) : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim().slice(0, 60) : "";
  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 5000) : "";

  if (!name || !message || (!email && !phone)) {
    return json(400, { error: "Please provide your name, message, and an email or phone number." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "The sender email address is invalid." });
  }

  // Read the recipient from the same admin-managed public setting used by the website.
  // Never trust a recipient address supplied by a browser request.
  let recipient: string;
  try {
    const settingsResponse = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/site_settings?id=eq.true&select=email`,
      { headers: { apikey: supabaseKey, authorization: `Bearer ${supabaseKey}` } },
    );
    if (!settingsResponse.ok) {
      return json(502, { error: "Could not read the enquiry destination from website settings." });
    }
    const settings = await settingsResponse.json();
    recipient = settings[0]?.email?.trim() || process.env.CONTACT_EMAIL?.trim() || "";
  } catch {
    return json(502, { error: "Could not read the enquiry destination from website settings." });
  }

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return json(503, { error: "Please configure a valid enquiry email in Admin → Settings." });
  }

  const html = [
    "<h2>New Fruitly website enquiry</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>`,
    "<p><strong>Message:</strong></p>",
    `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${resendApiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject: `Fruitly website enquiry from ${name}`,
        html,
        ...(email ? { reply_to: email } : {}),
      }),
    });
    if (!delivery.ok) {
      return json(502, { error: "Email delivery failed. Please try again or email us directly." });
    }
    return json(200, { ok: true });
  } catch {
    return json(502, { error: "Email delivery failed. Please try again or email us directly." });
  }
};

export const config = {
  path: "/.netlify/functions/send-enquiry",
};
