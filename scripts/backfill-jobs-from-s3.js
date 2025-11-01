import dotenv from "dotenv";
dotenv.config();

import { Client } from "pg";
import { S3Client, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

async function s3Exists(s3, bucket, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (err) {
    // NotFound or 404
    return false;
  }
}

async function findLatestWithPrefix(s3, bucket, prefix) {
  try {
    const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 1000 }));
    const items = list.Contents || [];
    if (!items.length) return null;
    // Prefer common image types and latest modified
    const preferred = items
      .filter(o => /\.(png|jpg|jpeg|webp)$/i.test(o.Key))
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
    if (preferred.length) return preferred[0].Key;
    // Fallback to latest any
    const latest = items.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];
    return latest?.Key || null;
  } catch (err) {
    console.error("List prefix failed:", prefix, err?.name || err?.message);
    return null;
  }
}

(async () => {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    console.error("Missing AWS env vars. Ensure S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are set.");
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  let scanned = 0;
  let updatedUpload = 0;
  let updatedResult = 0;
  let completedMarked = 0;

  try {
    const jobsRes = await pg.query(`
      SELECT id, user_id, status, upload_s3_key, result_s3_key, created_at, updated_at, completed_at
      FROM jobs
      ORDER BY created_at DESC
    `);

    for (const j of jobsRes.rows) {
      scanned += 1;
      const jobId = j.id;
      const userId = j.user_id;
      let uploadKey = j.upload_s3_key;
      let resultKey = j.result_s3_key;

      const uploadPrefix = `uploads/${userId}/${jobId}/`;
      const resultPrefix = `results/${userId}/${jobId}/`;

      // Backfill upload key
      if (uploadKey) {
        const ok = await s3Exists(s3, bucket, uploadKey);
        if (!ok) {
          const found = await findLatestWithPrefix(s3, bucket, uploadPrefix);
          if (found && found !== uploadKey) {
            await pg.query(`UPDATE jobs SET upload_s3_key = $1, updated_at = NOW() WHERE id = $2`, [found, jobId]);
            updatedUpload += 1;
            uploadKey = found;
            console.log(`[upload] job ${jobId} -> ${found}`);
          }
        }
      } else {
        const found = await findLatestWithPrefix(s3, bucket, uploadPrefix);
        if (found) {
          await pg.query(`UPDATE jobs SET upload_s3_key = $1, updated_at = NOW() WHERE id = $2`, [found, jobId]);
          updatedUpload += 1;
          uploadKey = found;
          console.log(`[upload] job ${jobId} -> ${found}`);
        }
      }

      // Backfill result key and mark completed
      let shouldComplete = false;
      if (resultKey) {
        const ok = await s3Exists(s3, bucket, resultKey);
        if (!ok) {
          const found = await findLatestWithPrefix(s3, bucket, resultPrefix);
          if (found && found !== resultKey) {
            resultKey = found;
            shouldComplete = true;
          }
        } else {
          shouldComplete = true;
        }
      } else {
        const found = await findLatestWithPrefix(s3, bucket, resultPrefix);
        if (found) {
          resultKey = found;
          shouldComplete = true;
        }
      }

      if (resultKey && shouldComplete) {
        // Update result key and mark job completed if not already
        const isCompleted = j.status === 'completed' && j.completed_at;
        if (!isCompleted || j.result_s3_key !== resultKey) {
          await pg.query(`UPDATE jobs SET result_s3_key = $1, status = 'completed', completed_at = COALESCE(completed_at, NOW()), updated_at = NOW() WHERE id = $2`, [resultKey, jobId]);
          updatedResult += 1;
          if (!isCompleted) completedMarked += 1;
          console.log(`[result] job ${jobId} -> ${resultKey} (completed)`);
        }
      }
    }

    console.log("backfill_summary:", JSON.stringify({ scanned, updatedUpload, updatedResult, completedMarked }));
  } catch (err) {
    console.error("BACKFILL_ERROR", err);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();