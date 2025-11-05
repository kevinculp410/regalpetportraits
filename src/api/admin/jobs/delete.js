import { Client } from "pg";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });
    if (!(await isAdmin(userId))) return res.status(403).json({ error: "admin_required" });

    const jobId = req.params?.id;
    if (!jobId) return res.status(400).json({ error: "job_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    // Look up job to get user_id and s3 keys for prefix computation
    const jr = await pg.query(`SELECT user_id, upload_s3_key, result_s3_key FROM pet_portraits.jobs WHERE id = $1 LIMIT 1`, [jobId]);
    if (!jr.rowCount) { await pg.end(); return res.status(404).json({ error: "not_found" }); }
    const { user_id: userIdForJob, upload_s3_key: uploadKey, result_s3_key: resultKey } = jr.rows[0];

    // Prepare S3 client
    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const canS3 = bucket && region && accessKeyId && secretAccessKey;
    const s3 = canS3 ? new S3Client({ region, credentials: { accessKeyId, secretAccessKey } }) : null;

    // Helper to delete a prefix worth of objects
    async function deletePrefix(prefix) {
      if (!s3) return 0;
      let deleted = 0;
      let ContinuationToken = undefined;
      while (true) {
        const listRes = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken }));
        const contents = listRes.Contents || [];
        if (!contents.length) break;
        const objects = contents.map(o => ({ Key: o.Key }));
        await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } }));
        deleted += objects.length;
        if (listRes.IsTruncated && listRes.NextContinuationToken) {
          ContinuationToken = listRes.NextContinuationToken;
        } else {
          break;
        }
      }
      return deleted;
    }

    // Compute job prefixes and delete
    if (canS3) {
      const uploadPrefix = `uploads/${userIdForJob}/${jobId}/`;
      const resultPrefix = `results/${userIdForJob}/${jobId}/`;
      try {
        const uDel = await deletePrefix(uploadPrefix);
        const rDel = await deletePrefix(resultPrefix);
        // Also attempt single-key deletes if not under prefix
        const tryDeleteKey = async (key) => {
          if (!key) return;
          if (key.startsWith(uploadPrefix) || key.startsWith(resultPrefix)) return;
          try {
            await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
          } catch (err) {
            const meta = err?.$metadata || {};
            console.error('S3 single key delete failed:', key, err?.name, err?.message, meta?.httpStatusCode);
          }
        };
        await tryDeleteKey(uploadKey);
        await tryDeleteKey(resultKey);
        console.log(`[admin/jobs/delete] job ${jobId} s3 deleted: ${uDel + rDel} objects`);
      } catch (err) {
        const meta = err?.$metadata || {};
        console.error('S3 prefix delete failed:', err?.name, err?.message, meta?.httpStatusCode);
      }
    }

    const r = await pg.query(`DELETE FROM pet_portraits.jobs WHERE id = $1`, [jobId]);

    await pg.end();

    if (!r.rowCount) return res.status(404).json({ error: "not_found" });
    return res.json({ success: true, id: jobId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}