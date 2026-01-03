import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from ".././config/s3.js";

export async function createUploadUrl(
  userId: string,
  fileName: string,
  fileType: string
) {
  const key = `songs/${userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return { uploadUrl, key };
}
