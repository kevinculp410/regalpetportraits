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

    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const inputDate = body.before_date || body.before || null;
    if (!inputDate) return res.status(400).json({ error: "before_date_required" });

    const cutoff = new Date(inputDate);
    if (isNaN(cutoff.getTime())) return res.status(400).json({ error: "invalid_date" });

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

    const cutoffIso = cutoff.toISOString();

    // Use transaction to keep operations consistent
    await pg.query('BEGIN');

    // Insert all matching jobs into archive table (excluding already-archived)
    const insertResult = await pg.query(`
      WITH to_archive AS (
        SELECT 
          j.id AS job_id, j.user_id, u.name AS user_name, u.email AS user_email,
          j.style_id, j.style_name, s.title AS style_title, s.preview_url AS style_preview_url,
          j.status, j.prompt_text, j.amount_cents,
          j.upload_s3_key, j.result_s3_key, j.composite_s3_key, j.result_s3_key_upscaled, j.composite_upscaled_url,
          j.created_at, j.updated_at, j.completed_at
        FROM pet_portraits.jobs j
        JOIN pet_portraits.users u ON u.id = j.user_id
        LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
        WHERE j.created_at < $1 AND (j.archived_at IS NULL)
      )
      INSERT INTO pet_portraits.jobs_archive (
        job_id, user_id, user_name, user_email, style_id, style_name, style_title, style_preview_url,
        status, prompt_text, amount_cents,
        upload_s3_key, result_s3_key, composite_s3_key, result_s3_key_upscaled, composite_upscaled_url,
        created_at, updated_at, completed_at
      )
      SELECT 
        job_id, user_id, user_name, user_email, style_id, style_name, style_title, style_preview_url,
        status, prompt_text, amount_cents,
        upload_s3_key, result_s3_key, composite_s3_key, result_s3_key_upscaled, composite_upscaled_url,
        created_at, updated_at, completed_at
      FROM to_archive;
    `, [cutoffIso]);

    const updateResult = await pg.query(`
      UPDATE pet_portraits.jobs j
      SET archived_at = NOW(), updated_at = NOW()
      WHERE j.created_at < $1 AND (j.archived_at IS NULL)
    `, [cutoffIso]);

    await pg.query('COMMIT');

    await pg.end();
    return res.json({ success: true, archived_rows: updateResult.rowCount, inserted_rows: insertResult.rowCount, cutoff: cutoffIso });
  } catch (e) {
    try { const pg = new Client({ connectionString: process.env.DATABASE_URL }); await pg.connect(); await pg.query('ROLLBACK'); await pg.end(); } catch (_) {}
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}