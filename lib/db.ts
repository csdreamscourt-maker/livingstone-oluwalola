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

export async function getUserAuthByEmail(email: string) {
  const result = await query('SELECT id, email, full_name, password_hash FROM users WHERE email = $1', [email]);
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

export type DreamInput = {
  title: string;
  description?: string | null;
  content?: string | null;
  date_occurred: string;
  mood?: string | null;
  tags?: string[] | null;
  clarity?: number | null;
  is_private?: boolean;
};

export type DreamUpdate = Partial<DreamInput> & {
  favorite?: boolean;
  is_archived?: boolean;
};

const DREAM_COLUMNS =
  'id, user_id, title, description, content, date_occurred, mood, tags, voice_recording_url, is_private, favorite, is_archived, clarity, created_at, updated_at';

export async function getDreamsByUser(userId: string) {
  const result = await query(
    `SELECT ${DREAM_COLUMNS} FROM dreams WHERE user_id = $1 ORDER BY date_occurred DESC`,
    [userId]
  );
  return result.rows;
}

export async function createDream(userId: string, input: DreamInput) {
  const result = await query(
    `INSERT INTO dreams (user_id, title, description, content, date_occurred, mood, tags, clarity, is_private)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true))
     RETURNING ${DREAM_COLUMNS}`,
    [
      userId,
      input.title,
      input.description ?? null,
      input.content ?? null,
      input.date_occurred,
      input.mood ?? null,
      input.tags ?? null,
      input.clarity ?? null,
      input.is_private ?? null,
    ]
  );
  return result.rows[0];
}

export async function updateDream(userId: string, id: string, updates: DreamUpdate) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i}`);
    values.push(value);
    i += 1;
  }
  if (!fields.length) return null;

  fields.push(`updated_at = timezone('utc'::text, now())`);
  values.push(id, userId);

  const result = await query(
    `UPDATE dreams SET ${fields.join(', ')} WHERE id = $${i} AND user_id = $${i + 1} RETURNING ${DREAM_COLUMNS}`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteDream(userId: string, id: string) {
  await query('DELETE FROM dreams WHERE id = $1 AND user_id = $2', [id, userId]);
}

export type JournalEntryInput = {
  title: string;
  content: string;
  prayer_type?: string | null;
  date_prayed: string;
  tags?: string[] | null;
};

export type JournalEntryUpdate = Partial<JournalEntryInput> & {
  is_answered?: boolean;
  answer_notes?: string | null;
  answer_date?: string | null;
};

const JOURNAL_COLUMNS =
  'id, user_id, title, content, prayer_type, date_prayed, tags, is_answered, answer_date, answer_notes, created_at, updated_at';

export async function getJournalEntriesByUser(userId: string) {
  const result = await query(
    `SELECT ${JOURNAL_COLUMNS} FROM prayer_journal WHERE user_id = $1 ORDER BY date_prayed DESC`,
    [userId]
  );
  return result.rows;
}

export async function createJournalEntry(userId: string, input: JournalEntryInput) {
  const result = await query(
    `INSERT INTO prayer_journal (user_id, title, content, prayer_type, date_prayed, tags)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${JOURNAL_COLUMNS}`,
    [userId, input.title, input.content, input.prayer_type ?? null, input.date_prayed, input.tags ?? null]
  );
  return result.rows[0];
}

export async function updateJournalEntry(userId: string, id: string, updates: JournalEntryUpdate) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${i}`);
    values.push(value);
    i += 1;
  }
  if (!fields.length) return null;

  fields.push(`updated_at = timezone('utc'::text, now())`);
  values.push(id, userId);

  const result = await query(
    `UPDATE prayer_journal SET ${fields.join(', ')} WHERE id = $${i} AND user_id = $${i + 1} RETURNING ${JOURNAL_COLUMNS}`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteJournalEntry(userId: string, id: string) {
  await query('DELETE FROM prayer_journal WHERE id = $1 AND user_id = $2', [id, userId]);
}
