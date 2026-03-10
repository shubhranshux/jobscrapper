const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Upload a file to AWS S3
 * @param {Buffer} fileBuffer
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {string} The S3 key (not a URL — use getSignedImageUrl to get a viewable link)
 */
async function uploadToS3(fileBuffer, fileName, mimeType) {
  const ext = path.extname(fileName) || '.jpg';
  const key = `profile-images/${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  // Return the S3 key — we'll generate signed URLs on demand
  return key;
}

/**
 * Generate a pre-signed URL for viewing an S3 object
 * @param {string} key - The S3 object key
 * @param {number} expiresIn - URL expiry in seconds (default 7 days)
 * @returns {string} Pre-signed URL
 */
async function getSignedImageUrl(key, expiresIn = 604800) {
  if (!key) return null;

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from AWS S3
 * @param {string} key - The S3 object key
 */
async function deleteFromS3(key) {
  try {
    if (!key) return;

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
  }
}

module.exports = { uploadToS3, deleteFromS3, getSignedImageUrl };
