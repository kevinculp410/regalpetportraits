import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
import { scryptSync } from "crypto";

function setCookie(res, userId) {
  const isHttps = (process.env.BASE_URL || '').startsWith('https://');
  const cookie = `uid=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const a = await pg.query(`SELECT id, email, password_hash, password_salt, user_id FROM pet_portraits.admins WHERE email = $1`, [email]);
    if (!a.rowCount) { await pg.end(); return res.status(401).json({ error: 'invalid_credentials' }); }
    const admin = a.rows[0];

    const hash = scryptSync(password, admin.password_salt, 64).toString('hex');
    if (hash !== admin.password_hash) { await pg.end(); return res.status(401).json({ error: 'invalid_credentials' }); }

    // ensure a corresponding users row exists
    let userId = admin.user_id;
    if (!userId) {
      const u = await pg.query(`SELECT id FROM pet_portraits.users WHERE email = $1`, [email]);
      if (u.rowCount) {
        userId = u.rows[0].id;
      } else {
        const nu = await pg.query(
          `INSERT INTO pet_portraits.users (id, email, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING id`,
          [email, 'Admin']
        );
        userId = nu.rows[0].id;
      }
      await pg.query(`UPDATE pet_portraits.admins SET user_id = $1, updated_at = NOW() WHERE id = $2`, [userId, admin.id]);
    }

    await pg.end();

    setCookie(res, userId);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}