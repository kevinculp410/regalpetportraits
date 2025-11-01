import { Client } from "pg";

export default async function handler(req, res) {
  try {
    const { token } = req.query || {};
    if (!token) return res.status(400).send("Missing token");

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Find valid token
    const t = await pg.query(
      `SELECT lt.token, lt.user_id, lt.expires_at, lt.used, u.email 
       FROM pet_portraits.login_tokens lt 
       JOIN pet_portraits.users u ON u.id = lt.user_id 
       WHERE lt.token = $1`,
      [token]
    );
    if (!t.rowCount) {
      await pg.end();
      return res.status(400).send("Invalid token");
    }
    const row = t.rows[0];
    if (row.used) { await pg.end(); return res.status(400).send("Token used"); }
    if (new Date(row.expires_at) < new Date()) { await pg.end(); return res.status(400).send("Token expired"); }

    // Mark used
    await pg.query(`UPDATE pet_portraits.login_tokens SET used = TRUE WHERE token = $1`, [token]);

    // Set a simple cookie with user_id; only add Secure when using HTTPS
    const isHttps = (process.env.BASE_URL || '').startsWith('https://');
    const cookie = `uid=${row.user_id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;
    res.setHeader("Set-Cookie", cookie);

    await pg.end();
    // Redirect to dashboard
    return res.redirect(302, `${process.env.BASE_URL}/dashboard`);
  } catch (e) {
    console.error(e);
    return res.status(500).send("server_error");
  }
}