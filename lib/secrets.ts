import 'server-only';
import crypto from 'crypto';
import { getAppSecret, setAppSecret, deleteAppSecret, listAppSecretKeys } from '@/lib/db';

const ALGORITHM = 'aes-256-gcm';

function getMasterKey(): Buffer {
  const key = process.env.SECRETS_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('SECRETS_ENCRYPTION_KEY environment variable is not set');
  }
  return crypto.createHash('sha256').update(key).digest();
}

function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decrypt(payload: string): string {
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv(ALGORITHM, getMasterKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

export const SECRET_KEYS = [
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'ADMIN_NOTIFICATION_EMAIL',
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
] as const;

export type SecretKey = (typeof SECRET_KEYS)[number];

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { value: string | null; expires: number }>();

export async function getSecret(key: SecretKey): Promise<string | null> {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.value;
  }

  const encrypted = await getAppSecret(key);
  const value = encrypted ? decrypt(encrypted) : (process.env[key] ?? null);
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function setSecret(key: SecretKey, plaintext: string): Promise<void> {
  await setAppSecret(key, encrypt(plaintext));
  cache.delete(key);
}

export async function clearSecret(key: SecretKey): Promise<void> {
  await deleteAppSecret(key);
  cache.delete(key);
}

export async function listConfiguredSecrets(): Promise<{ key: SecretKey; configured: boolean }[]> {
  const dbKeys = new Set(await listAppSecretKeys());
  return SECRET_KEYS.map((key) => ({
    key,
    configured: dbKeys.has(key) || Boolean(process.env[key]),
  }));
}
