import { Client } from "pg";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });

    const { style_id, prompt_text } = req.body || {};
    if (!style_id) return res.status(400).json({ error: "style_id required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const j = await pg.query(
      `INSERT INTO pet_portraits.jobs (id, user_id, style_id, status, prompt_text, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 'created', $3, NOW(), NOW())
       RETURNING id;`,
      [userId, style_id, prompt_text || null]
    );
    const jobId = j.rows[0].id;

    await pg.end();

    return res.json({
      job_id: jobId,
      upload_key_prefix: `uploads/${userId}/${jobId}/`
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}