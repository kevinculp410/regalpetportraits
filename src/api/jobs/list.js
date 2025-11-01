import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    try {
      // Get user's jobs with style information
      const result = await pg.query(`
        SELECT 
          j.id,
          j.style_id,
          j.status,
          j.prompt_text,
          j.created_at,
          j.updated_at,
          j.completed_at,
          j.upload_s3_key,
          j.result_s3_key,
          j.composite_s3_key,
          j.composite_upscaled_url,
          s.title as style_title,
          s.description as style_description
        FROM pet_portraits.jobs j
        LEFT JOIN pet_portraits.styles s ON s.id::text = j.style_id
        WHERE j.user_id::text = $1
        ORDER BY j.created_at DESC
      `, [userId]);

      await pg.end();

      // Prepare S3 client for presigned GET URLs (only if S3 config is present)
      const canPresign = process.env.S3_BUCKET && process.env.AWS_REGION;
      const s3 = canPresign ? new S3Client({ region: process.env.AWS_REGION, credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } }) : null;

      const jobs = await Promise.all(result.rows.map(async row => {
        const hasPhoto = !!row.upload_s3_key;
        const hasAnyResult = !!(row.result_s3_key || row.composite_s3_key);
        let resultUrl = "";
        let compositeUrl = "";

        if (row.result_s3_key) {
          if (s3) {
            try {
              const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: row.result_s3_key });
              resultUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
            } catch (e) {
              resultUrl = `/api/jobs/${row.id}/result`;
            }
          } else {
            resultUrl = `/api/jobs/${row.id}/result`;
          }
        }

        if (row.composite_s3_key) {
          if (s3) {
            try {
              const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: row.composite_s3_key });
              compositeUrl = await getSignedUrl(s3, cmd, { expiresIn: 600 });
            } catch (e) {
              // Fallback: if presign fails, leave empty so UI falls back
              compositeUrl = "";
            }
          }
        }

        return {
          id: row.id,
          style_id: row.style_id,
          style_title: row.style_title || 'Unknown Style',
          style_description: row.style_description || '',
          status: row.status,
          prompt_text: row.prompt_text || '',
          created_at: row.created_at,
          updated_at: row.updated_at,
          completed_at: row.completed_at,
          // expose raw S3 keys for upstream consumers (checkout pet_file construction)
          upload_s3_key: row.upload_s3_key || '',
          result_s3_key: row.result_s3_key || '',
          composite_s3_key: row.composite_s3_key || '',
          composite_upscaled_url: row.composite_upscaled_url || '',
          has_photo: hasPhoto,
          has_result: hasAnyResult,
          result_url: resultUrl,
          composite_url: compositeUrl,
          view_url: compositeUrl || resultUrl
        };
      }));

      return res.json({ 
        data: jobs,
        count: jobs.length 
      });

    } catch (dbError) {
      await pg.end();
      throw dbError;
    }

  } catch (e) {
    console.error("Jobs list error:", e);
    return res.status(500).json({ error: "server_error" });
  }
}