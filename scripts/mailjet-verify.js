import dotenv from "dotenv";
import Mailjet from "node-mailjet";

dotenv.config();

async function verify() {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error("MAILJET_API_KEY or MAILJET_SECRET_KEY missing in .env");
    process.exit(1);
  }

  const mailjet = Mailjet.apiConnect(apiKey, secretKey);

  try {
    // Simple GET call to validate credentials
    await mailjet.get("contact").request({ Limit: 1 });
    console.log("Mailjet auth OK: credentials accepted");
  } catch (e) {
    console.error("Mailjet auth failed:", e?.ErrorMessage || e?.message || e);
    process.exit(1);
  }

  try {
    // Send in sandbox mode to verify send capability without delivering
    const resp = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        SandboxMode: true,
        Messages: [
          {
            From: { Email: process.env.MAILJET_FROM_EMAIL || process.env.ADMIN_EMAIL, Name: process.env.MAILJET_FROM_NAME || "Regal Pet Portraits" },
            To: [{ Email: process.env.ADMIN_EMAIL }],
            Subject: "Mailjet verification (sandbox)",
            TextPart: "Sandbox send worked. Keys and send permissions OK.",
          },
        ],
      });
    console.log("Mailjet sandbox send OK", JSON.stringify(resp?.body, null, 2));
  } catch (e) {
    console.error("Mailjet sandbox send failed:", e?.ErrorMessage || e?.message || e);
    process.exit(1);
  }
}

verify();