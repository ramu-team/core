import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadImageToS3(file: File): Promise<string> {
  const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PNG, JPG, and WEBP are allowed.");
  }
  
  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File exceeds 5MB limit");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const finalFileName = `jamu/${Date.now()}-${cleanFileName}`;

  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("S3_BUCKET_NAME is not configured");
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: finalFileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const publicUrlBase = process.env.S3_PUBLIC_URL;
  if (!publicUrlBase) {
    throw new Error("S3_PUBLIC_URL is not configured.");
  }

  return `${publicUrlBase.replace(/\/$/, '')}/${finalFileName}`;
}
