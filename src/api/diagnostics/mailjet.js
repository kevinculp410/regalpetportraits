import Mailjet from "node-mailjet";

export default async function handler(req, res) {
  try {
    const mjPublicSource = process.env.MAILJET_API_KEY !== undefined ? 'MAILJET_API_KEY'
      : process.env.MJ_APIKEY_PUBLIC !== undefined ? 'MJ_APIKEY_PUBLIC'
      : process.env.MAILJET_PUBLIC_KEY !== undefined ? 'MAILJET_PUBLIC_KEY'
      : null;
    const mjPrivateSource = process.env.MAILJET_SECRET_KEY !== undefined ? 'MAILJET_SECRET_KEY'
      : process.env.MJ_APIKEY_PRIVATE !== undefined ? 'MJ_APIKEY_PRIVATE'
      : process.env.MAILJET_PRIVATE_KEY !== undefined ? 'MAILJET_PRIVATE_KEY'
      : null;
    const normalize = (v) => {
      const t = (v || '').trim();
      // strip wrapping quotes if present
      if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        return t.slice(1, -1).trim();
      }
      return t;
    };
    const mjPublic = normalize(
      process.env.MAILJET_API_KEY || process.env.MJ_APIKEY_PUBLIC || process.env.MAILJET_PUBLIC_KEY
    );
    const mjPrivate = normalize(
      process.env.MAILJET_SECRET_KEY || process.env.MJ_APIKEY_PRIVATE || process.env.MAILJET_PRIVATE_KEY
    );

    const fromEmail = (process.env.MAILJET_FROM_EMAIL || process.env.ADMIN_EMAIL || "").trim();
    const fromName = (process.env.MAILJET_FROM_NAME || "Regal Pet Portraits").trim();
    const toEmail = (process.env.ADMIN_EMAIL || fromEmail || "").trim();

    if (!mjPublic || !mjPrivate) {
      return res.status(200).json({
        auth_ok: false,
        send_ok: false,
        error_auth: "missing_keys",
        from_email: fromEmail || null,
        from_name: fromName,
        to_email: toEmail || null,
        key_source_public: mjPublicSource,
        key_source_private: mjPrivateSource,
        key_len_public: mjPublic ? mjPublic.length : 0,
        key_len_private: mjPrivate ? mjPrivate.length : 0,
      });
    }

    const mailjet = Mailjet.apiConnect(mjPublic, mjPrivate);

    let authOk = false;
    let sendOk = false;
    let authError = null;
    let sendError = null;

    try {
      await mailjet.get("contact").request({ Limit: 1 });
      authOk = true;
    } catch (e) {
      authError = e?.ErrorMessage || e?.message || String(e);
    }

    if (authOk) {
      try {
        const resp = await mailjet
          .post("send", { version: "v3.1" })
          .request({
            SandboxMode: true,
            Messages: [
              {
                From: { Email: fromEmail, Name: fromName },
                To: [{ Email: toEmail }],
                Subject: "Mailjet diagnostics (sandbox)",
                TextPart: "Sandbox send worked. Keys and send permissions OK.",
              },
            ],
          });
        // If response contains Messages with Status 'success', treat as OK
        const status = Array.isArray(resp?.body?.Messages)
          ? resp.body.Messages[0]?.Status
          : null;
        sendOk = status === "success" || !!resp?.body;
      } catch (e) {
        sendError = e?.ErrorMessage || e?.message || String(e);
      }
    }

    return res.json({
      auth_ok: authOk,
      send_ok: sendOk,
      from_email: fromEmail || null,
      from_name: fromName,
      to_email: toEmail || null,
      error_auth: authError,
      error_send: sendError,
      key_source_public: mjPublicSource,
      key_source_private: mjPrivateSource,
      key_len_public: mjPublic ? mjPublic.length : 0,
      key_len_private: mjPrivate ? mjPrivate.length : 0,
    });
  } catch (e) {
    return res.status(500).json({ error: "mailjet_diag_failed" });
  }
}