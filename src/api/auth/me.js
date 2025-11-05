import { Client } from "pg";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.json({ logged_in: false });

    // Dev/local fallback: if no database configured, return admin user from env
    if (!process.env.DATABASE_URL) {
      if (userId === 'dev-admin' && process.env.ADMIN_EMAIL) {
        return res.json({ logged_in: true, user: { id: 'dev-admin', email: process.env.ADMIN_EMAIL, name: 'Admin', email_verified: true, created_at: new Date().toISOString() } });
      }
      return res.json({ logged_in: false });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const u = await pg.query(`SELECT id, email, name, email_verified, created_at FROM pet_portraits.users WHERE id = $1`, [userId]);
    await pg.end();

    if (!u.rowCount) return res.json({ logged_in: false });

    const user = u.rows[0];
    return res.json({ logged_in: true, user: { id: user.id, email: user.email, name: user.name || "", email_verified: !!user.email_verified, created_at: user.created_at } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}