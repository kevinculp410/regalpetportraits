import Mailjet from "node-mailjet";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

    const { name, email, message } = req.body || {};
    if (!email || !message) return res.status(400).json({ error: "email_and_message_required" });

    const toEmail = "blueskyaiaa@gmail.com";

    const mailjet = Mailjet.apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);
    const fromEmail = process.env.MAILJET_FROM_EMAIL || "no-reply@emailpetportraits.com";
    const fromName = process.env.MAILJET_FROM_NAME || "Regal Pet Portraits";

    const subject = `New contact inquiry from ${name || email}`;
    const text = `New contact inquiry\n\nName: ${name || "(not provided)"}\nEmail: ${email}\n\nMessage:\n${message}`;
    const html = `
      <h2>New contact inquiry</h2>
      <p><strong>Name:</strong> ${name || "(not provided)"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${(message || "").replace(/\n/g, "<br/>")}</p>
    `;

    await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: fromEmail, Name: fromName },
            To: [{ Email: toEmail }],
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
            ReplyTo: { Email: email, Name: name || email },
          },
        ],
      });

    return res.json({ ok: true });
  } catch (e) {
    try {
      const status = e?.status || e?.code || 'unknown_status';
      const msg = e?.message || 'unknown_error';
      const respText = e?.response?.text || e?.response?.data || '';
      console.error("contact_send_error", { status, msg, respText });
    } catch (_) {
      console.error("contact_send_error_raw", e);
    }
    return res.status(500).json({ error: "server_error" });
  }
}