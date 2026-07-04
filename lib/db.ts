import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
      connectionString: databaseUrl,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const result = await getPool().query(text, params);
  return result;
}

export async function getUser(id: string) {
  const result = await query('SELECT id, email, full_name, avatar_url, bio, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await query('SELECT id, email, full_name, avatar_url, bio, created_at FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(email: string, passwordHash: string, fullName?: string) {
  const result = await query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, avatar_url, bio, created_at',
    [email, passwordHash, fullName || null]
  );
  return result.rows[0];
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
  const result = await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING id, token, expires_at',
    [userId, token, expiresAt]
  );
  return result.rows[0];
}

export async function getSessionByToken(token: string) {
  const result = await query(
    'SELECT id, user_id, token, expires_at FROM sessions WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  return result.rows[0] || null;
}

export async function deleteSession(token: string) {
  await query('DELETE FROM sessions WHERE token = $1', [token]);
}
