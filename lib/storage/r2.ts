import 'server-only';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSecret } from '@/lib/secrets';

async function getR2Client(): Promise<S3Client> {
  const [accountId, accessKeyId, secretAccessKey] = await Promise.all([
    getSecret('R2_ACCOUNT_ID'),
    getSecret('R2_ACCESS_KEY_ID'),
    getSecret('R2_SECRET_ACCESS_KEY'),
  ]);

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Storage is not configured (missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  const [bucket, publicUrl] = await Promise.all([getSecret('R2_BUCKET_NAME'), getSecret('R2_PUBLIC_URL')]);

  if (!bucket || !publicUrl) {
    throw new Error('Storage is not configured (missing R2_BUCKET_NAME / R2_PUBLIC_URL)');
  }

  const client = await getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${publicUrl.replace(/\/$/, '')}/${key}`;
}
