import { Client } from "pg";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.json({ logged_in: false, is_admin: false });

    // Dev/local fallback: if no database configured, infer admin from cookie and env
    if (!process.env.DATABASE_URL) {
      const adminEmail = process.env.ADMIN_EMAIL || '';
      const isAdmin = userId === 'dev-admin' && !!adminEmail;
      if (!isAdmin) return res.json({ logged_in: true, is_admin: false });
      return res.json({ logged_in: true, is_admin: true, user: { email: adminEmail } });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    const schema = process.env.DB_SCHEMA || 'pet_portraits';
    // Prefer admins table membership; fallback to admins by email, then configured ADMIN_EMAIL
    let isAdmin = false;
    let email = null;
    try {
      const a = await pg.query(`SELECT 1 FROM ${schema}.admins WHERE user_id = $1`, [userId]);
      if (a.rowCount) {
        const u = await pg.query(`SELECT email FROM ${schema}.users WHERE id = $1`, [userId]);
        email = u.rows[0]?.email || null;
        isAdmin = true;
      } else {
        const u = await pg.query(`SELECT email FROM ${schema}.users WHERE id = $1`, [userId]);
        email = u.rows[0]?.email || null;
        // Robust fallback: if the email exists in admins table, treat as admin
        if (email) {
          const ae = await pg.query(`SELECT 1 FROM ${schema}.admins WHERE email = $1`, [email]);
          if (ae.rowCount) isAdmin = true;
        }
        // Secondary fallback: configured ADMIN_EMAIL
        if (!isAdmin) {
          const configuredAdminEmail = process.env.ADMIN_EMAIL || '';
          isAdmin = !!email && !!configuredAdminEmail && email === configuredAdminEmail;
        }
      }
    } finally {
      await pg.end();
    }

    return res.json({ logged_in: true, is_admin: isAdmin, user: { email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}