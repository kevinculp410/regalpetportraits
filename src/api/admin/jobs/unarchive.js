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
    const a = await pg.query(`SELECT 1 FROM pet_portraits.admins WHERE user_id = $1`, [userId]);
    if (a.rowCount) { await pg.end(); return true; }
    const result = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
    const userEmail = result.rows[0]?.email;
    await pg.end();
    return userEmail === (process.env.ADMIN_EMAIL || '');
  } catch (e) {
    await pg.end();
    return false;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const jobId = req.params?.id || req.body?.job_id;
    if (!jobId) return res.status(400).json({ error: "job_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();
    await pg.query('BEGIN');
    // Clear archived flag
    const upd = await pg.query(`UPDATE pet_portraits.jobs SET archived_at = NULL, updated_at = NOW() WHERE id = $1`, [jobId]);
    // Remove archive record; keep history optional by commenting out if needed
    const del = await pg.query(`DELETE FROM pet_portraits.jobs_archive WHERE job_id = $1`, [jobId]);
    await pg.query('COMMIT');
    await pg.end();
    return res.json({ success: true, job_id: jobId, unarchived: upd.rowCount, removed_archive_rows: del.rowCount });
  } catch (e) {
    try { const pg = new Client({ connectionString: process.env.DATABASE_URL }); await pg.connect(); await pg.query('ROLLBACK'); await pg.end(); } catch (_) {}
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}