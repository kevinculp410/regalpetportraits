import dotenv from "dotenv";
dotenv.config();

import { Client } from "pg";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

async function deletePrefix(s3, bucket, prefix) {
  let deleted = 0;
  let ContinuationToken = undefined;
  while (true) {
    const listRes = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken })
    );
    const contents = listRes.Contents || [];
    if (contents.length === 0) {
      break;
    }
    // Batch delete up to 1000 keys per request
    const objects = contents.map((o) => ({ Key: o.Key }));
    await s3.send(
      new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: objects } })
    );
    deleted += objects.length;
    if (listRes.IsTruncated && listRes.NextContinuationToken) {
      ContinuationToken = listRes.NextContinuationToken;
    } else {
      break;
    }
  }
  return deleted;
}

(async () => {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    console.error(
      "Missing AWS env vars. Ensure S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are set."
    );
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  // Ensure composite_s3_key exists for optional single-key cleanup
  await pg.query(`ALTER TABLE pet_portraits.jobs ADD COLUMN IF NOT EXISTS composite_s3_key TEXT`);

  const force = process.argv.includes("--force");
  const dryRun = process.argv.includes("--dry-run");

  if (!force && !dryRun) {
    console.error(
      "Refusing to run without --force (or use --dry-run to preview)."
    );
    await pg.end();
    process.exit(1);
  }

  let jobsCount = 0;
  let s3DeletedTotal = 0;
  let s3SingleKeyDeleted = 0;
  let dbDeleted = 0;

  try {
    const jobsRes = await pg.query(
      `SELECT id, user_id, upload_s3_key, result_s3_key, composite_s3_key FROM pet_portraits.jobs ORDER BY created_at DESC`
    );
    jobsCount = jobsRes.rowCount;

    for (const j of jobsRes.rows) {
      const jobId = j.id;
      const userId = j.user_id;
      const uploadPrefix = `uploads/${userId}/${jobId}/`;
      const resultPrefix = `results/${userId}/${jobId}/`;
      const compositePrefix = `composites/${userId}/${jobId}/`;

      if (dryRun) {
        console.log(`[DRY] would delete prefixes`, { uploadPrefix, resultPrefix, compositePrefix });
      } else {
        const uDel = await deletePrefix(s3, bucket, uploadPrefix);
        const rDel = await deletePrefix(s3, bucket, resultPrefix);
        const cDel = await deletePrefix(s3, bucket, compositePrefix);
        s3DeletedTotal += uDel + rDel + cDel;
        if (uDel + rDel + cDel > 0) {
          console.log(`[S3] deleted ${uDel + rDel + cDel} objects for job ${jobId}`);
        }
      }

      // Also attempt direct key deletes if present and not under the expected prefix
      const tryDeleteKey = async (key) => {
        if (!key) return;
        if (key.startsWith(uploadPrefix) || key.startsWith(resultPrefix) || key.startsWith(compositePrefix)) return; // already covered by prefix
        if (dryRun) {
          console.log(`[DRY] would delete single key`, { key });
          return;
        }
        try {
          await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
          s3SingleKeyDeleted += 1;
          console.log(`[S3] deleted single key for job ${jobId}: ${key}`);
        } catch (err) {
          const meta = err?.$metadata || {};
          console.error(
            `S3 single key delete failed: ${key}`,
            err?.name,
            err?.message,
            meta?.httpStatusCode
          );
        }
      };

      await tryDeleteKey(j.upload_s3_key);
      await tryDeleteKey(j.result_s3_key);
      await tryDeleteKey(j.composite_s3_key);

      if (dryRun) {
        console.log(`[DRY] would delete DB row for job ${jobId}`);
      } else {
        const r = await pg.query(`DELETE FROM pet_portraits.jobs WHERE id = $1`, [jobId]);
        if (r.rowCount) {
          dbDeleted += r.rowCount;
          console.log(`[DB] deleted job ${jobId}`);
        }
      }
    }

    // Optional pass: scrub orphaned job prefixes directly from S3
    if (process.argv.includes("--scrub-orphaned")) {
      const scrub = async (base) => {
        let ContinuationToken = undefined;
        const prefixes = new Set();
        while (true) {
          const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: base, ContinuationToken }));
          const contents = r.Contents || [];
          for (const o of contents) {
            const k = o.Key || "";
            // match base/<uid>/<jobId>/
            const m = k.match(/^(.+?\/[^/]+\/[^/]+)\//);
            if (m) prefixes.add(m[1] + "/");
          }
          if (r.IsTruncated && r.NextContinuationToken) {
            ContinuationToken = r.NextContinuationToken;
          } else {
            break;
          }
        }
        for (const p of prefixes) {
          const del = dryRun ? 0 : await deletePrefix(s3, bucket, p);
          s3DeletedTotal += del;
          console.log(`[S3] scrubbed orphaned prefix ${p} deleted=${del}`);
        }
      };
      await scrub("uploads/");
      await scrub("results/");
      await scrub("composites/");
    }
    console.log(
      `Done. jobs scanned=${jobsCount}, s3 objects deleted=${s3DeletedTotal}, extra keys deleted=${s3SingleKeyDeleted}, db rows deleted=${dbDeleted}`
    );
  } catch (e) {
    console.error("Cleanup failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();