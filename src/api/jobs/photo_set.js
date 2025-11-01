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

    const jobId = req.params?.id;
    const { s3_key } = req.body || {};
    if (!jobId || !s3_key) return res.status(400).json({ error: "job_id and s3_key required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Verify job ownership
    const j = await pg.query(`SELECT id FROM pet_portraits.jobs WHERE id = $1 AND user_id = $2 LIMIT 1`, [jobId, userId]);
    if (!j.rowCount) {
      await pg.end();
      return res.status(404).json({ error: "job_not_found" });
    }

    await pg.query(`UPDATE pet_portraits.jobs SET upload_s3_key = $1, updated_at = NOW() WHERE id = $2`, [s3_key, jobId]);
    await pg.end();

    return res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}