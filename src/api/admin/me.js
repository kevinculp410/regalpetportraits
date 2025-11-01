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

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const u = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
    const email = u.rows[0]?.email || null;
    await pg.end();

    const isAdmin = !!email && email === process.env.ADMIN_EMAIL;
    return res.json({ logged_in: true, is_admin: isAdmin });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}