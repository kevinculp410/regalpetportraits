import { Client } from "pg";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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

    // Check admin permissions
    if (!(await isAdmin(userId))) {
      return res.status(403).json({ error: "admin_required" });
    }

    const { title, description, imageData, fileName } = req.body || {};
    if (!title || !imageData || !fileName) {
      return res.status(400).json({ error: "title, imageData, and fileName required" });
    }

    // Use original filename for S3 key
    const s3Key = `styles/${fileName}`;
    
    // Extract file extension for MIME type detection
    const fileExt = fileName.split('.').pop();

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    let previewUrl;

    // Enforce S3-only uploads. If S3 fails, return 500 with details.
    const dev = process.env.NODE_ENV !== 'production';

    if (!process.env.S3_BUCKET || !process.env.AWS_REGION) {
      return res.status(500).json({
        error: 's3_config_missing',
        details: dev ? { message: 'S3_BUCKET or AWS_REGION missing', env: { S3_BUCKET: !!process.env.S3_BUCKET, AWS_REGION: process.env.AWS_REGION } } : undefined
      });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const mime = (() => {
      const ext = (fileExt || '').toLowerCase();
      if (ext === 'png') return 'image/png';
      if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
      if (ext === 'webp') return 'image/webp';
      return `image/${ext || 'png'}`;
    })();

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: mime,
      CacheControl: 'public, max-age=31536000'
    });

    try {
      await s3Client.send(uploadCommand);
      previewUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (err) {
      console.error('S3 upload failed:', err);
      const meta = err?.$metadata || {};
      const details = dev ? {
        name: err?.name,
        message: err?.message,
        httpStatusCode: meta.httpStatusCode,
        requestId: meta.requestId,
        bucket: process.env.S3_BUCKET,
        key: s3Key,
        region: process.env.AWS_REGION,
      } : undefined;
      return res.status(500).json({ error: 's3_upload_failed', details });
    }

    // Save to database
    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const result = await pg.query(`
      INSERT INTO pet_portraits.styles (title, description, preview_url, s3_key, original_filename, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, title, description, preview_url, original_filename
    `, [title, description || null, previewUrl, s3Key, fileName]);

    await pg.end();

    return res.json({ 
      success: true,
      style: result.rows[0]
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}