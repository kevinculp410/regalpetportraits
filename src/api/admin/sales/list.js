import { Client } from "pg";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "../../../lib/s3.js";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

async function isAdmin(userId) {
  if (!userId) return false;
  if (!process.env.DATABASE_URL) {
    return (userId === 'dev-admin' && !!process.env.ADMIN_EMAIL);
  }
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const result = await pg.query(`SELECT email FROM pet_portraits.users WHERE id = $1`, [userId]);
    const userEmail = result.rows[0]?.email;
    await pg.end();
    return userEmail === process.env.ADMIN_EMAIL;
  } catch (e) {
    try { await pg.end(); } catch (_) {}
    return (userId === 'dev-admin' && !!process.env.ADMIN_EMAIL);
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    // Dev fallback when DB missing
    if (!process.env.DATABASE_URL) {
      return res.json({ ok: true, items: [] });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Gracefully detect archived_at presence
    const hasArchivedCol = (await pg.query(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'pet_portraits' AND table_name = 'jobs' AND column_name = 'archived_at'
       ) AS present`
    )).rows[0]?.present === true;

    // Filters
    const start = (req.query.start || '').trim();
    const end = (req.query.end || '').trim();
    const username = (req.query.username || '').trim();
    const where = [];
    const params = [];
    let p = 1;
    if (start) { where.push(`j.created_at >= $${p++}`); params.push(new Date(start)); }
    if (end) { where.push(`j.created_at <= $${p++}`); params.push(new Date(end)); }
    if (username) { where.push(`(LOWER(u.email) LIKE LOWER($${p}) OR LOWER(u.name) LIKE LOWER($${p}))`); params.push(`%${username}%`); p++; }
    if (hasArchivedCol) { where.push(`(j.archived_at IS NULL)`); }
    const whereSql = where.length ? (`WHERE ${where.join(' AND ')}`) : '';

    const q = `
      SELECT 
        j.id AS job_id,
        j.user_id,
        u.email AS user_email,
        u.name AS user_name,
        j.style_id,
        s.title AS style_title,
        s.preview_url AS style_preview_url,
        j.upload_s3_key,
        j.result_s3_key,
        j.composite_s3_key,
        j.composite_upscaled_url,
        j.amount_cents,
        j.created_at
      FROM pet_portraits.jobs j
      JOIN pet_portraits.users u ON u.id = j.user_id
      LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
      ${whereSql}
      ORDER BY j.created_at DESC
      LIMIT 1000
    `;

    const rows = (await pg.query(q, params)).rows;
    await pg.end();

    const canPresign = process.env.S3_BUCKET && (process.env.AWS_REGION || true);
    const s3 = canPresign ? await createS3Client() : null;

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
        job_id: r.job_id,
        user_id: r.user_id,
        user_email: r.user_email || "",
        user_name: r.user_name || "",
        style_id: r.style_id || "",
        style_title: r.style_title || "",
        style_preview_url: r.style_preview_url || "",
        upload_s3_key: r.upload_s3_key || "",
        result_s3_key: r.result_s3_key || "",
        composite_s3_key: r.composite_s3_key || "",
        composite_upscaled_url: r.composite_upscaled_url || "",
        amount_cents: r.amount_cents,
        created_at: r.created_at,
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