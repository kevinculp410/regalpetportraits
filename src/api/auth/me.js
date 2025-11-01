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

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const u = await pg.query(`SELECT id, email, name, email_verified FROM pet_portraits.users WHERE id = $1`, [userId]);
    await pg.end();

    if (!u.rowCount) return res.json({ logged_in: false });

    const user = u.rows[0];
    return res.json({ logged_in: true, user: { id: user.id, email: user.email, name: user.name || "", email_verified: !!user.email_verified } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}