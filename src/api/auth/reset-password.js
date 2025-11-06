import { Client } from "pg";
import { randomBytes, scryptSync } from "crypto";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { token, new_password } = req.body || {};
    if (!token || !new_password) return res.status(400).json({ error: "token and new_password required" });
    if (String(new_password).length < 8) return res.status(400).json({ error: "password_too_short" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      const schema = process.env.DB_SCHEMA || "pet_portraits";
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

      const { rows } = await pg.query(
        `SELECT token, user_id, expires_at, used FROM ${schema}.password_reset_tokens WHERE token = $1 LIMIT 1`,
        [token]
      );
      if (!rows.length) {
        await pg.end();
        return res.status(400).json({ error: "invalid_token" });
      }
      const t = rows[0];
      if (t.used) {
        await pg.end();
        return res.status(400).json({ error: "token_used" });
      }
      if (new Date(t.expires_at).getTime() < Date.now()) {
        await pg.end();
        return res.status(400).json({ error: "token_expired" });
      }

      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(new_password, salt, 64).toString("hex");
      await pg.query(`UPDATE ${schema}.users SET password_hash = $1, password_salt = $2 WHERE id = $3`, [hash, salt, t.user_id]);
      // If this user corresponds to an admin, update admins table too (keep passwords in sync)
      try {
        // Update by user_id and also by email to handle legacy rows missing user linkage
        const u = await pg.query(`SELECT email FROM ${schema}.users WHERE id = $1`, [t.user_id]);
        const email = u.rows[0]?.email || null;
        await pg.query(`UPDATE ${schema}.admins SET password_hash = $1, password_salt = $2, updated_at = NOW() WHERE user_id = $3`, [hash, salt, t.user_id]);
        if (email) {
          await pg.query(`UPDATE ${schema}.admins SET password_hash = $1, password_salt = $2, updated_at = NOW() WHERE email = $3`, [hash, salt, email]);
        }
      } catch (_) {
        // Ignore if admins table doesn't exist
      }
      await pg.query(`UPDATE ${schema}.password_reset_tokens SET used = TRUE WHERE token = $1`, [token]);

      await pg.end();
      return res.json({ success: true });
    } catch (dbError) {
      await pg.end();
      throw dbError;
    }
  } catch (e) {
    console.error("Reset password error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}