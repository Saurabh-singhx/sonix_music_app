import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from ".././config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

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


export async function createImageUploadUrl(
  userId: string,
  imageType: "profile" | "gallery" | "cover",
  fileType: string,
  refId?: string
) {

  let key: string;

  if (imageType === "profile") {
    key = `users/${userId}/profile.jpg`;

  } else if (imageType === "gallery") {
    key = `users/${userId}/gallery/${crypto.randomUUID()}.jpg`;

  } else {
    if (!refId) throw new Error("refId (songId) required");
    key = `songs/${refId}/cover.jpg`;
  }

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


export async function getFileUrl(s3Key: string) {
  
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: s3Key,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 60 * 10, // 10 min
  });
}

