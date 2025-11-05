import { Client } from "pg";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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
    // Use POST for simplicity from the browser
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const rows = (await pg.query(`SELECT id, s3_key, preview_url FROM pet_portraits.styles`)).rows;

    // Prepare S3 client once
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    let s3Deleted = 0;
    let localDeleted = 0;

    for (const style of rows) {
      if (style.s3_key && process.env.S3_BUCKET) {
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: style.s3_key }));
          s3Deleted += 1;
        } catch (err) {
          console.error('S3 delete failed:', style.s3_key, err?.name, err?.message);
        }
      }
      if (style.preview_url && style.preview_url.startsWith('/uploads/styles/')) {
        try {
          const localPath = path.join(process.cwd(), 'public', style.preview_url.replace(/^\//, ''));
          await fs.unlink(localPath).then(() => { localDeleted += 1; }).catch(() => {});
        } catch (_) {}
      }
    }

    const r = await pg.query(`DELETE FROM pet_portraits.styles`);
    await pg.end();

    return res.json({ success: true, deleted_rows: r.rowCount, s3_deleted: s3Deleted, local_deleted: localDeleted });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}