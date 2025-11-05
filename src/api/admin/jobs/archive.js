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
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const jobId = req.params?.id;
    if (!jobId) return res.status(400).json({ error: "job_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Ensure schema/table/columns exist for archive and jobs.archived_at
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    await pg.query(`
      CREATE TABLE IF NOT EXISTS pet_portraits.jobs_archive (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL,
        user_id UUID NOT NULL,
        user_name TEXT,
        user_email TEXT,
        style_id TEXT,
        style_name TEXT,
        style_title TEXT,
        style_preview_url TEXT,
        status TEXT,
        prompt_text TEXT,
        amount_cents NUMERIC(10,2),
        upload_s3_key TEXT,
        result_s3_key TEXT,
        composite_s3_key TEXT,
        result_s3_key_upscaled TEXT,
        composite_upscaled_url TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await pg.query(`ALTER TABLE pet_portraits.jobs_archive ADD COLUMN IF NOT EXISTS style_title TEXT`);
    await pg.query(`ALTER TABLE pet_portraits.jobs_archive ADD COLUMN IF NOT EXISTS style_preview_url TEXT`);
    await pg.query(`ALTER TABLE pet_portraits.jobs ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ`);

    // Fetch job with user context
    const r = await pg.query(`
      SELECT 
        j.id, j.user_id, j.style_id, j.style_name, j.status, j.prompt_text, j.amount_cents,
        j.upload_s3_key, j.result_s3_key, j.composite_s3_key, j.result_s3_key_upscaled, j.composite_upscaled_url,
        j.created_at, j.updated_at, j.completed_at,
        u.name as user_name, u.email as user_email,
        s.title as style_title, s.preview_url as style_preview_url
      FROM pet_portraits.jobs j
      JOIN pet_portraits.users u ON u.id = j.user_id
      LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
      WHERE j.id = $1
      LIMIT 1
    `, [jobId]);
    if (!r.rowCount) { await pg.end(); return res.status(404).json({ error: "not_found" }); }
    const j = r.rows[0];

    // Insert into archive table
    await pg.query(`
      INSERT INTO pet_portraits.jobs_archive (
        job_id, user_id, user_name, user_email, style_id, style_name, style_title, style_preview_url,
        status, prompt_text, amount_cents,
        upload_s3_key, result_s3_key, composite_s3_key, result_s3_key_upscaled, composite_upscaled_url,
        created_at, updated_at, completed_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19
      )
    `, [
      j.id, j.user_id, j.user_name || null, j.user_email || null, j.style_id || null, j.style_name || null,
      j.style_title || null, j.style_preview_url || null,
      j.status || null, j.prompt_text || null, j.amount_cents || null,
      j.upload_s3_key || null, j.result_s3_key || null, j.composite_s3_key || null,
      j.result_s3_key_upscaled || null, j.composite_upscaled_url || null,
      j.created_at || null, j.updated_at || null, j.completed_at || null
    ]);

    // Mark original job as archived
    await pg.query(`UPDATE pet_portraits.jobs SET archived_at = NOW(), updated_at = NOW() WHERE id = $1`, [jobId]);

    await pg.end();
    return res.json({ success: true, id: jobId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}