import { Client } from "pg";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

async function isAdmin(userId) {
  if (!userId) return false;
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const result = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
    const userEmail = result.rows[0]?.email;
    await pg.end();
    return userEmail === process.env.ADMIN_EMAIL;
  } catch (e) {
    await pg.end();
    return false;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const rows = (await pg.query(`
      SELECT 
        u.id as user_id, u.email, u.name, u.created_at as user_created_at,
        j.id as job_id, j.style_id, j.status, j.prompt_text, j.created_at as job_created_at
      FROM pet_portraits.users u
      LEFT JOIN pet_portraits.jobs j ON j.user_id = u.id
      ORDER BY u.created_at DESC, j.created_at DESC
    `)).rows;

    await pg.end();

    const usersMap = new Map();
    for (const r of rows) {
      if (!usersMap.has(r.user_id)) {
        usersMap.set(r.user_id, {
          id: r.user_id,
          email: r.email,
          name: r.name || "",
          created_at: r.user_created_at,
          jobs: []
        });
      }
      if (r.job_id) {
        usersMap.get(r.user_id).jobs.push({
          id: r.job_id,
          style_id: r.style_id,
          status: r.status,
          prompt_text: r.prompt_text || "",
          created_at: r.job_created_at
        });
      }
    }

    const data = Array.from(usersMap.values());
    return res.json({ data, count: data.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}