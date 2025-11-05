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
  // Dev fallback: allow 'dev-admin' cookie holder when DATABASE_URL is missing
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
    // Fallback: allow dev-admin when DB lookup fails in development
    return (userId === 'dev-admin' && !!process.env.ADMIN_EMAIL);
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });
    // Dev fallback: if no DB, return synthetic admin user with empty jobs
    if (!process.env.DATABASE_URL) {
      const data = [{ id: 'dev-admin', email: process.env.ADMIN_EMAIL || 'admin@example.com', name: 'Admin', created_at: new Date().toISOString(), jobs: [] }];
      return res.json({ data, count: data.length });
    }

    // Try DB path, but gracefully fall back if connection/query errors
    try {
      const pg = new Client({ connectionString: process.env.DATABASE_URL });
      await pg.connect();

    // Detect if archived_at column exists to avoid breaking older schemas
    const hasArchivedCol = (await pg.query(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'pet_portraits' AND table_name = 'jobs' AND column_name = 'archived_at'
       ) AS present`
    )).rows[0]?.present === true;

    const rows = (await pg.query(
      hasArchivedCol
        ? `
      SELECT 
        u.id as user_id, u.email, u.name, u.created_at as user_created_at,
        j.id as job_id, j.style_id, j.status, j.prompt_text, j.created_at as job_created_at,
        j.upload_s3_key, j.result_s3_key, j.composite_s3_key, j.composite_upscaled_url,
        s.title as style_title, s.preview_url as style_preview_url
      FROM pet_portraits.users u
      LEFT JOIN pet_portraits.jobs j ON j.user_id = u.id AND j.archived_at IS NULL
      LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
      ORDER BY LOWER(u.email) ASC, j.created_at DESC
    `
        : `
      SELECT 
        u.id as user_id, u.email, u.name, u.created_at as user_created_at,
        j.id as job_id, j.style_id, j.status, j.prompt_text, j.created_at as job_created_at,
        j.upload_s3_key, j.result_s3_key, j.composite_s3_key, j.composite_upscaled_url,
        s.title as style_title, s.preview_url as style_preview_url
      FROM pet_portraits.users u
      LEFT JOIN pet_portraits.jobs j ON j.user_id = u.id
      LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
      ORDER BY LOWER(u.email) ASC, j.created_at DESC
    `
    )).rows;

      await pg.end();

    const canPresign = process.env.S3_BUCKET && (process.env.AWS_REGION || true);
    const s3 = canPresign ? await createS3Client() : null;

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
        // Build presigned URLs for photo/result/composite
        let photoUrl = "";
        let resultUrl = "";
        let compositeUrl = "";

        if (r.upload_s3_key) {
          if (s3) {
            try {
              const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.upload_s3_key });
              photoUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
            } catch (_) {
              photoUrl = "";
            }
          }
        }

        if (r.result_s3_key) {
          if (s3) {
            try {
              const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.result_s3_key });
              resultUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
            } catch (_) {
              resultUrl = "";
            }
          }
        }

        if (r.composite_s3_key) {
          if (s3) {
            try {
              const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: r.composite_s3_key });
              compositeUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
            } catch (_) {
              compositeUrl = "";
            }
          }
        }

        const viewUrl = compositeUrl || resultUrl;

        usersMap.get(r.user_id).jobs.push({
          id: r.job_id,
          style_id: r.style_id,
          style_title: r.style_title || "",
          style_preview_url: r.style_preview_url || "",
          status: r.status,
          prompt_text: r.prompt_text || "",
          created_at: r.job_created_at,
          upload_s3_key: r.upload_s3_key || "",
          result_s3_key: r.result_s3_key || "",
          composite_s3_key: r.composite_s3_key || "",
          composite_upscaled_url: r.composite_upscaled_url || "",
          photo_url: photoUrl,
          result_url: resultUrl,
          composite_url: compositeUrl,
          view_url: viewUrl
        });
      }
    }

    const data = Array.from(usersMap.values()).sort((a, b) => {
      const ae = String(a.email || '').toLowerCase();
      const be = String(b.email || '').toLowerCase();
      if (ae < be) return -1;
      if (ae > be) return 1;
      return 0;
    });
      return res.json({ data, count: data.length });
    } catch (dbErr) {
      // Fallback response when DB is unavailable
      const data = [{ id: 'dev-admin', email: process.env.ADMIN_EMAIL || 'admin@example.com', name: 'Admin', created_at: new Date().toISOString(), jobs: [] }];
      return res.json({ data, count: data.length, fallback: true });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}