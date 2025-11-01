import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import { Client as PgClient } from "pg";

async function findLatestUpload(s3, bucket, prefix) {
  const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, MaxKeys: 1000 }));
  const items = r.Contents || [];
  if (!items.length) return null;
  const preferred = items
    .filter(o => /(png|jpg|jpeg|webp)$/i.test(o.Key || ''))
    .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
  return (preferred[0] || items[0]).Key || null;
}

async function main() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  const userId = process.argv[2];
  const jobId = process.argv[3];
  const destName = process.argv[4] || 'final.png';

  if (!userId || !jobId) {
    console.error("Usage: node scripts/s3-copy-to-results.js <userId> <jobId> [destFilename]");
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  const pg = new PgClient({ connectionString: databaseUrl });
  await pg.connect();

  try {
    const uploadPrefix = `uploads/${userId}/${jobId}/`;
    const srcKey = await findLatestUpload(s3, bucket, uploadPrefix);
    if (!srcKey) {
      console.error("No uploaded source found under:", uploadPrefix);
      process.exit(1);
    }

    const destKey = `results/${userId}/${jobId}/${destName}`;
    const copySource = `${bucket}/${srcKey}`;

    await s3.send(new CopyObjectCommand({ Bucket: bucket, Key: destKey, CopySource: copySource, MetadataDirective: 'COPY' }));
    console.log("Copied to:", destKey);

    await pg.query(
      `UPDATE pet_portraits.jobs SET result_s3_key = $1, status = 'completed', completed_at = COALESCE(completed_at, NOW()), updated_at = NOW() WHERE id = $2`,
      [destKey, jobId]
    );
    console.log("DB updated for job:", jobId);
  } catch (err) {
    console.error("Copy failed:", err);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});