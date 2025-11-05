import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) {
    console.error("Missing S3_BUCKET or AWS_REGION in .env");
    process.exit(1);
  }

  const client = new S3Client({ region, credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }});

  // Allow localhost dev and all production origins (vercel.app and custom domain)
  const origins = [
    "http://localhost:3003",
    "http://localhost:3002",
    "https://www.regalpetportraits.com",
    "*" // allow any origin for client-side presigned PUTs
  ];

  const corsRules = [
    {
      AllowedMethods: ["GET", "PUT", "POST", "HEAD"],
      AllowedOrigins: origins,
      AllowedHeaders: ["*"],
      ExposeHeaders: ["ETag", "x-amz-request-id"],
      MaxAgeSeconds: 3000,
    },
    // OPTIONS preflight for browsers
    {
      AllowedMethods: ["OPTIONS"],
      AllowedOrigins: origins,
      AllowedHeaders: ["*"],
      MaxAgeSeconds: 3000,
    }
  ];

  try {
    // Show current CORS for reference
    try {
      const current = await client.send(new GetBucketCorsCommand({ Bucket: bucket }));
      console.log("Current CORS:", JSON.stringify(current?.CORSConfiguration || {}, null, 2));
    } catch (e) {
      console.warn("Could not read current CORS (may be empty):", e?.name || e?.message);
    }

    // Apply CORS configuration
    const putCmd = new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: { CORSRules: corsRules },
    });
    await client.send(putCmd);
    console.log("Updated CORS configuration for bucket", bucket);
  } catch (err) {
    console.error("Failed to update bucket CORS:", err);
    process.exit(1);
  }
}

main();