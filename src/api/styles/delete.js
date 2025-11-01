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
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const id = req.params?.id;
    if (!id) return res.status(400).json({ error: "style_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const r = await pg.query(`SELECT id, s3_key, preview_url FROM pet_portraits.styles WHERE id = $1 LIMIT 1`, [id]);
    if (!r.rowCount) { await pg.end(); return res.status(404).json({ error: "not_found" }); }
    const style = r.rows[0];

    // Try to delete from S3 when possible
    const dev = process.env.NODE_ENV !== 'production';
    if (style.s3_key && process.env.S3_BUCKET) {
      try {
        const s3 = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
        await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: style.s3_key }));
      } catch (err) {
        const meta = err?.$metadata || {};
        // Log but do not block deletion
        console.error('S3 delete failed:', err?.name, err?.message, meta?.httpStatusCode);
      }
    }

    // Delete local file if it exists
    try {
      if (style.preview_url && style.preview_url.startsWith('/uploads/styles/')) {
        const localPath = path.join(process.cwd(), 'public', style.preview_url.replace(/^\//, ''));
        await fs.unlink(localPath).catch(() => {});
      }
    } catch (_) {}

    await pg.query(`DELETE FROM pet_portraits.styles WHERE id = $1`, [id]);
    await pg.end();

    return res.json({ success: true, id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}