import { randomBytes } from "crypto";
import { Client } from "pg";
import Mailjet from "node-mailjet";
import { getSiteBase } from "../../util/site.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "email required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      const schema = process.env.DB_SCHEMA || "pet_portraits";

      // Ensure schema and password_reset_tokens table exists
      await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
      await pg.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.password_reset_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID NOT NULL REFERENCES ${schema}.users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pg.query(`CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON ${schema}.password_reset_tokens(token)`);
      await pg.query(`CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON ${schema}.password_reset_tokens(user_id)`);

      // Validate admin existence
      const a = await pg.query(`SELECT id, email, user_id FROM ${schema}.admins WHERE email = $1 LIMIT 1`, [email]);
      if (!a.rowCount) {
        await pg.end();
        // Do nothing if not an admin; respond success to avoid enumeration
        return res.json({ success: true, message: "If an admin exists, a reset email has been sent." });
      }

      let userId = a.rows[0].user_id;
      // Ensure a users row exists for this admin for token association
      if (!userId) {
        const u = await pg.query(`SELECT id FROM ${schema}.users WHERE email = $1 LIMIT 1`, [email]);
        if (u.rowCount) {
          userId = u.rows[0].id;
        } else {
          const nu = await pg.query(
            `INSERT INTO ${schema}.users (id, email, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING id`,
            [email, "Admin"]
          );
          userId = nu.rows[0].id;
        }
        await pg.query(`UPDATE ${schema}.admins SET user_id = $1, updated_at = NOW() WHERE id = $2`, [userId, a.rows[0].id]);
      }

      // Create reset token (valid for 1 hour)
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await pg.query(
        `INSERT INTO ${schema}.password_reset_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)`,
        [token, userId, expiresAt]
      );

      // Build site URL for front-end route
      const siteBase = getSiteBase(req);
      const resetLink = `${siteBase}/reset-password?token=${token}`;

      // Send reset email via Mailjet (skip if not configured)
      const mjKey = process.env.MAILJET_API_KEY;
      const mjSecret = process.env.MAILJET_SECRET_KEY;
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
                Subject: "Admin password reset - Regal Pet Portraits",
                TextPart: `Reset your admin password: ${resetLink}`,
                HTMLPart: `
                  <h2>Admin Password Reset</h2>
                  <p>Click below to set a new password for your admin account.</p>
                  <p><a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
                  <p>Or copy and paste this link: ${resetLink}</p>
                  <p>This link will expire in 1 hour.</p>
                `,
              },
            ],
          });
      } else {
        console.warn("Mailjet not configured; skipping admin reset email send.");
        console.warn("Admin reset link:", resetLink);
      }

      await pg.end();
      return res.json({ success: true });
    } catch (dbError) {
      await pg.end();
      throw dbError;
    }
  } catch (e) {
    console.error("Admin forgot password error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}