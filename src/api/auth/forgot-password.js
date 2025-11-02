import { randomBytes } from "crypto";
import { Client } from "pg";
import Mailjet from "node-mailjet";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      // Ensure schema and password_reset_tokens table exists
      await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
      await pg.query(`
        CREATE TABLE IF NOT EXISTS pet_portraits.password_reset_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID NOT NULL REFERENCES pet_portraits.users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pg.query(`CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON pet_portraits.password_reset_tokens(token)`);
      await pg.query(`CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON pet_portraits.password_reset_tokens(user_id)`);

      // Look up user quietly (do not leak account existence)
      const u = await pg.query(`SELECT id, email_verified FROM pet_portraits.users WHERE email = $1 LIMIT 1`, [email]);
      if (!u.rowCount) {
        await pg.end();
        // Always respond success to prevent email enumeration
        return res.json({ success: true, message: "If an account exists, a reset email has been sent." });
      }

      const userId = u.rows[0].id;

      // Create reset token (valid for 1 hour)
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await pg.query(
        `INSERT INTO pet_portraits.password_reset_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)`,
        [token, userId, expiresAt]
      );

      // Build site URL for front-end route; ensure we don't include a trailing '/api'
      const rawBase = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const siteBase = rawBase.replace(/\/api\/?$/, "");
      const resetLink = `${siteBase}/reset-password?token=${token}`;

      // Send reset email via Mailjet (skip in dev if not configured)
      const mjKey = process.env.MAILJET_API_KEY;
      const mjSecret = process.env.MAILJET_SECRET_KEY;
      const isProd = process.env.NODE_ENV === "production";
      if (mjKey && mjSecret) {
        const mailjet = Mailjet.apiConnect(mjKey, mjSecret);
        await mailjet
          .post("send", { version: "v3.1" })
          .request({
            Messages: [
              {
                From: {
                  Email: process.env.MAILJET_FROM_EMAIL || "no-reply@emailpetportraits.com",
                  Name: process.env.MAILJET_FROM_NAME || "Regal Pet Portraits",
                },
                To: [{ Email: email }],
                Subject: "Reset your password - Regal Pet Portraits",
                TextPart: `You requested a password reset. Click the link to set a new password: ${resetLink}`,
                HTMLPart: `
                  <h2>Password Reset</h2>
                  <p>We received a request to reset your password. Click below to set a new password.</p>
                  <p><a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
                  <p>Or copy and paste this link: ${resetLink}</p>
                  <p>This link will expire in 1 hour. If you didn’t request this, you can ignore this email.</p>
                `,
              },
            ],
          });
      } else {
        // In any environment where Mailjet isn't configured, log and continue
        console.warn("Mailjet not configured; skipping email send.");
        console.warn("Reset link:", resetLink);
      }

      await pg.end();
      return res.json({ success: true, message: "If an account exists, a reset email has been sent." });
    } catch (dbError) {
      await pg.end();
      throw dbError;
    }
  } catch (e) {
    console.error("Forgot password error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}