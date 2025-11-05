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
    // Prefer admins table membership; fallback to configured ADMIN_EMAIL
    let isAdmin = false;
    let email = null;
    try {
      const a = await pg.query(`SELECT 1 FROM pet_portraits.admins WHERE user_id = $1`, [userId]);
      if (a.rowCount) {
        const u = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
        email = u.rows[0]?.email || null;
        isAdmin = true;
      } else {
        const u = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
        email = u.rows[0]?.email || null;
        const configuredAdminEmail = process.env.ADMIN_EMAIL || '';
        isAdmin = !!email && !!configuredAdminEmail && email === configuredAdminEmail;
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