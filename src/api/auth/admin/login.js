import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
import { scryptSync } from "crypto";
import { setAuthCookie } from "../../util/cookies.js";

function setCookie(req, res, userId) {
  setAuthCookie(req, res, userId);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    // Dev/local fallback: if no database configured, allow admin login via env
    if (!process.env.DATABASE_URL) {
      const configuredAdminEmail = process.env.ADMIN_EMAIL || '';
      const devPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEV_PASSWORD || '';
      if (!configuredAdminEmail) return res.status(500).json({ error: 'server_not_configured' });
      if (email !== configuredAdminEmail) return res.status(403).json({ error: 'admin_required' });
      if (devPassword && password !== devPassword) return res.status(401).json({ error: 'invalid_credentials' });
      // Set an auth cookie with a stable dev admin id
      setCookie(req, res, 'dev-admin');
      return res.json({ ok: true });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    const schema = process.env.DB_SCHEMA || 'pet_portraits';

    // Primary: try admin table
    const a = await pg.query(`SELECT id, email, password_hash, password_salt, user_id FROM ${schema}.admins WHERE email = $1`, [email]);
    let userId = null;
    if (a.rowCount) {
      const admin = a.rows[0];
      const hash = scryptSync(password, admin.password_salt, 64).toString('hex');
      if (hash !== admin.password_hash) { await pg.end(); return res.status(401).json({ error: 'invalid_credentials' }); }

      // ensure a corresponding users row exists
      userId = admin.user_id;
      if (!userId) {
        const u = await pg.query(`SELECT id FROM ${schema}.users WHERE email = $1`, [email]);
        if (u.rowCount) {
          userId = u.rows[0].id;
        } else {
          const nu = await pg.query(
            `INSERT INTO ${schema}.users (id, email, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING id`,
            [email, 'Admin']
          );
          userId = nu.rows[0].id;
        }
        await pg.query(`UPDATE ${schema}.admins SET user_id = $1, updated_at = NOW() WHERE id = $2`, [userId, admin.id]);
      }
    } else {
      // Fallback: allow admin to sign in using users table if email matches and ADMIN_EMAIL is set
      const u = await pg.query(
        `SELECT id, email, password_hash, password_salt, email_verified FROM ${schema}.users WHERE email = $1`,
        [email]
      );
      if (!u.rowCount) { await pg.end(); return res.status(401).json({ error: 'invalid_credentials' }); }
      const user = u.rows[0];
      if (!user.email_verified) { await pg.end(); return res.status(401).json({ error: 'email_not_verified' }); }
      const hash = scryptSync(password, user.password_salt, 64).toString('hex');
      if (hash !== user.password_hash) { await pg.end(); return res.status(401).json({ error: 'invalid_credentials' }); }
      // Only allow if this account is the configured admin
      const configuredAdminEmail = process.env.ADMIN_EMAIL || '';
      if (!configuredAdminEmail || configuredAdminEmail !== user.email) {
        await pg.end();
        return res.status(403).json({ error: 'admin_required' });
      }
      userId = user.id;
    }

    await pg.end();

    setCookie(req, res, userId);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}