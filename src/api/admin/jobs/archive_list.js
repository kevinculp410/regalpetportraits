import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const start = req.query?.start_date || req.query?.start || null;
    const end = req.query?.end_date || req.query?.end || null;
    const limit = Math.min(parseInt(req.query?.limit || "200", 10) || 200, 500);

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    await pg.query(`CREATE TABLE IF NOT EXISTS pet_portraits.jobs_archive (id uuid)`); // minimal guard; full ensure is handled by scripts

    const params = [];
    const where = [];
    if (start) { params.push(new Date(start).toISOString()); where.push(`archived_at >= $${params.length}`); }
    if (end) { params.push(new Date(end).toISOString()); where.push(`archived_at <= $${params.length}`); }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT 
        ja.job_id, ja.user_id, ja.user_name, ja.user_email,
        ja.style_id, ja.style_name,
        s.title AS style_title, s.preview_url AS style_preview_url,
        ja.status, ja.prompt_text, ja.amount_cents,
        ja.upload_s3_key, ja.result_s3_key, ja.composite_s3_key, ja.result_s3_key_upscaled, ja.composite_upscaled_url,
        ja.created_at, ja.updated_at, ja.completed_at, ja.archived_at
      FROM pet_portraits.jobs_archive ja
      LEFT JOIN pet_portraits.styles s ON s.id::text = ja.style_id
      ${whereSql}
      ORDER BY ja.archived_at DESC
      LIMIT ${limit}
    `;
    const result = await pg.query(sql, params);
    await pg.end();

    const rows = result.rows || [];
    // Prepare S3 client for presigned GET URLs (only if S3 config is present)
    const canPresign = process.env.S3_BUCKET && process.env.AWS_REGION;
    const s3 = canPresign ? new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      }
    }) : null;

    const items = await Promise.all(rows.map(async r => {
      let photoUrl = "";
      let resultUrl = "";
      let compositeUrl = "";

      if (r.upload_s3_key && s3) {
        try {
          const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.upload_s3_key });
          photoUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
        } catch (_) {}
      }
      if (r.result_s3_key && s3) {
        try {
          const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.result_s3_key });
          resultUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
        } catch (_) {}
      }
      if (r.composite_s3_key && s3) {
        try {
          const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.composite_s3_key });
          compositeUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
        } catch (_) {}
      }
      if (!compositeUrl && r.composite_upscaled_url) {
        compositeUrl = r.composite_upscaled_url;
      }

      return {
        ...r,
        photo_url: photoUrl,
        result_url: resultUrl,
        composite_url: compositeUrl
      };
    }));

    return res.json({ ok: true, items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}