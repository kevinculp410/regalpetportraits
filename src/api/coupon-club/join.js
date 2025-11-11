import { Client } from "pg";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { first_name, last_name, email } = req.body || {};
    const f = String(first_name || '').trim();
    const l = String(last_name || '').trim();
    const e = String(email || '').trim();
    if (!f || !l || !e) return res.status(400).json({ error: "first_name, last_name, email required" });
    if (!e.includes('@') || !e.includes('.')) return res.status(400).json({ error: "invalid_email" });

    // Dev/local fallback: if no database configured, pretend success
    if (!process.env.DATABASE_URL) {
      return res.json({ ok: true, dev: true });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    const schema = process.env.DB_SCHEMA || 'pet_portraits';

    try {
      await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
      try { await pg.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`); } catch (_) {}
      await pg.query(`
        CREATE TABLE IF NOT EXISTS ${schema}.coupon_club (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pg.query(`CREATE INDEX IF NOT EXISTS coupon_club_email_idx ON ${schema}.coupon_club(email)`);

      await pg.query(
        `INSERT INTO ${schema}.coupon_club (first_name, last_name, email)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, updated_at = NOW()`,
        [f, l, e]
      );

      await pg.end();
      return res.json({ ok: true });
    } catch (dbErr) {
      await pg.end();
      if (process.env.NODE_ENV !== 'production') {
        // In development, don't block UI preview if DB is unavailable
        return res.json({ ok: true, dev: true });
      }
      throw dbErr;
    }
  } catch (e) {
    console.error("coupon_club_join_error", e);
    return res.status(500).json({ error: "server_error" });
  }
}