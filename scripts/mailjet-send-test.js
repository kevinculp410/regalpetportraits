import dotenv from "dotenv";
import Mailjet from "node-mailjet";

dotenv.config();

async function sendTest(toEmail) {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  if (!apiKey || !secretKey) {
    console.error("MAILJET_API_KEY or MAILJET_SECRET_KEY missing in .env");
    process.exit(1);
  }

  const fromEmail = process.env.MAILJET_FROM_EMAIL || "no-reply@emailpetportraits.com";
  const fromName = process.env.MAILJET_FROM_NAME || "Regal Pet Portraits";

  const mailjet = Mailjet.apiConnect(apiKey, secretKey);
  try {
    const resp = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: fromEmail, Name: fromName },
            To: [{ Email: toEmail }],
            Subject: "Password reset email delivery test",
            TextPart: "This is a delivery test from Regal Pet Portraits.",
            HTMLPart: `<h2>Delivery Test</h2><p>This is a delivery test from Regal Pet Portraits.</p>`,
          },
        ],
      });
    console.log("Mailjet send OK:", JSON.stringify(resp?.body, null, 2));
  } catch (e) {
    console.error("Mailjet send failed:", e?.ErrorMessage || e?.message || e);
    process.exit(1);
  }
}

const to = process.argv[2];
if (!to) {
  console.error("Usage: node scripts/mailjet-send-test.js recipient@example.com");
  process.exit(1);
}

sendTest(to);