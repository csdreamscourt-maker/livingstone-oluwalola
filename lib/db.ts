import { Pool } from 'pg';
import type { Framework, Company, IdeasArticle } from '@/types/database';
import { SETTINGS_DEFAULTS } from '@/lib/settingsSchema';

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

export async function query(text: string, params?: unknown[]) {
  const result = await getPool().query(text, params);
  return result;
}

const USER_COLUMNS = 'id, email, full_name, avatar_url, bio, role, created_at';

export async function getUser(id: string) {
  const result = await query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await query(`SELECT ${USER_COLUMNS} FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

export async function getUserAuthByEmail(email: string) {
  const result = await query(`SELECT id, email, full_name, role, password_hash FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

export async function createUser(email: string, passwordHash: string, fullName?: string) {
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING ${USER_COLUMNS}`,
    [email, passwordHash, fullName || null]
  );
  return result.rows[0];
}

export async function listUsers() {
  const result = await query(
    `SELECT u.${USER_COLUMNS.split(', ').join(', u.')},
       (SELECT count(*) FROM dreams d WHERE d.user_id = u.id) AS dream_count,
       (SELECT count(*) FROM prayer_journal p WHERE p.user_id = u.id) AS journal_count
     FROM users u ORDER BY u.created_at DESC`
  );
  return result.rows;
}

export async function updateUserRole(id: string, role: 'user' | 'admin') {
  const result = await query(`UPDATE users SET role = $1 WHERE id = $2 RETURNING ${USER_COLUMNS}`, [role, id]);
  return result.rows[0] || null;
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
  folder_id?: string | null;
  voice_recording_url?: string | null;
};

export type DreamUpdate = Partial<DreamInput> & {
  favorite?: boolean;
  is_archived?: boolean;
};

const DREAM_COLUMNS =
  'id, user_id, title, description, content, date_occurred, mood, tags, voice_recording_url, is_private, favorite, is_archived, clarity, folder_id, created_at, updated_at';

export async function getDreamsByUser(userId: string) {
  const result = await query(
    `SELECT ${DREAM_COLUMNS} FROM dreams WHERE user_id = $1 ORDER BY date_occurred DESC`,
    [userId]
  );
  return result.rows;
}

export async function createDream(userId: string, input: DreamInput) {
  const result = await query(
    `INSERT INTO dreams (user_id, title, description, content, date_occurred, mood, tags, clarity, is_private, folder_id, voice_recording_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true), $10, $11)
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
      input.folder_id ?? null,
      input.voice_recording_url ?? null,
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

export async function getDreamById(userId: string, id: string) {
  const result = await query(
    `SELECT ${DREAM_COLUMNS} FROM dreams WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return result.rows[0] || null;
}

export type DreamInterpretationInput = {
  interpretation: string;
  key_themes?: string[] | null;
  symbolic_meanings?: string | null;
  psychological_insights?: string | null;
  biblical_references?: string[] | null;
  confidence_score?: number | null;
  model_used?: string | null;
};

export async function upsertDreamInterpretation(dreamId: string, userId: string, input: DreamInterpretationInput) {
  const result = await query(
    `INSERT INTO dream_interpretations
       (dream_id, user_id, interpretation, key_themes, symbolic_meanings, psychological_insights, biblical_references, confidence_score, model_used)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (dream_id) DO UPDATE SET
       interpretation = EXCLUDED.interpretation,
       key_themes = EXCLUDED.key_themes,
       symbolic_meanings = EXCLUDED.symbolic_meanings,
       psychological_insights = EXCLUDED.psychological_insights,
       biblical_references = EXCLUDED.biblical_references,
       confidence_score = EXCLUDED.confidence_score,
       model_used = EXCLUDED.model_used
     RETURNING *`,
    [
      dreamId,
      userId,
      input.interpretation,
      input.key_themes ?? null,
      input.symbolic_meanings ?? null,
      input.psychological_insights ?? null,
      input.biblical_references ?? null,
      input.confidence_score ?? null,
      input.model_used ?? null,
    ]
  );
  return result.rows[0];
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

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function createContactMessage(input: ContactMessageInput) {
  const result = await query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, subject, message, created_at`,
    [input.name, input.email, input.subject, input.message]
  );
  return result.rows[0];
}

export async function subscribeToNewsletter(email: string) {
  const result = await query(
    `INSERT INTO newsletter_subscriptions (email, is_subscribed, subscribed_at, unsubscribed_at)
     VALUES ($1, true, timezone('utc'::text, now()), null)
     ON CONFLICT (email) DO UPDATE SET
       is_subscribed = true,
       subscribed_at = timezone('utc'::text, now()),
       unsubscribed_at = null
     RETURNING id, email, is_subscribed, subscribed_at`,
    [email]
  );
  return result.rows[0];
}

// --- Dream folders ---

export async function getDreamFoldersByUser(userId: string) {
  const result = await query('SELECT id, user_id, name, created_at FROM dream_folders WHERE user_id = $1 ORDER BY name', [userId]);
  return result.rows;
}

export async function createDreamFolder(userId: string, name: string) {
  const result = await query(
    'INSERT INTO dream_folders (user_id, name) VALUES ($1, $2) RETURNING id, user_id, name, created_at',
    [userId, name]
  );
  return result.rows[0];
}

export async function deleteDreamFolder(userId: string, id: string) {
  await query('DELETE FROM dream_folders WHERE id = $1 AND user_id = $2', [id, userId]);
}

// --- Courses (Academy) ---

export type CourseInput = {
  title: string;
  slug: string;
  description?: string | null;
  price_display?: string | null;
  selar_url?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
};

const COURSE_COLUMNS = 'id, title, slug, description, price_display, selar_url, thumbnail_url, is_published, created_at, updated_at';

export async function listCourses(publishedOnly: boolean) {
  const result = await query(
    `SELECT ${COURSE_COLUMNS} FROM courses ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getCourseBySlug(slug: string) {
  const result = await query(`SELECT ${COURSE_COLUMNS} FROM courses WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createCourse(input: CourseInput) {
  const result = await query(
    `INSERT INTO courses (title, slug, description, price_display, selar_url, thumbnail_url, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true)) RETURNING ${COURSE_COLUMNS}`,
    [input.title, input.slug, input.description ?? null, input.price_display ?? null, input.selar_url ?? null, input.thumbnail_url ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateCourse(id: string, updates: Partial<CourseInput>) {
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
  values.push(id);
  const result = await query(`UPDATE courses SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${COURSE_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteCourse(id: string) {
  await query('DELETE FROM courses WHERE id = $1', [id]);
}

// --- Dream symbols (Library) ---

export type DreamSymbolInput = {
  term: string;
  meaning: string;
  category?: string | null;
  scripture_reference?: string | null;
};

const DREAM_SYMBOL_COLUMNS = 'id, term, meaning, category, scripture_reference, created_at, updated_at';

export async function listDreamSymbols() {
  const result = await query(`SELECT ${DREAM_SYMBOL_COLUMNS} FROM dream_symbols ORDER BY term`);
  return result.rows;
}

export async function createDreamSymbol(input: DreamSymbolInput) {
  const result = await query(
    `INSERT INTO dream_symbols (term, meaning, category, scripture_reference) VALUES ($1, $2, $3, $4) RETURNING ${DREAM_SYMBOL_COLUMNS}`,
    [input.term, input.meaning, input.category ?? null, input.scripture_reference ?? null]
  );
  return result.rows[0];
}

export async function updateDreamSymbol(id: string, updates: Partial<DreamSymbolInput>) {
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
  values.push(id);
  const result = await query(`UPDATE dream_symbols SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${DREAM_SYMBOL_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteDreamSymbol(id: string) {
  await query('DELETE FROM dream_symbols WHERE id = $1', [id]);
}

// --- Dream articles (Library) ---

export type DreamArticleInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  category?: string | null;
  is_published?: boolean;
};

const DREAM_ARTICLE_COLUMNS = 'id, title, slug, excerpt, body, category, is_published, created_at, updated_at';

export async function listDreamArticles(publishedOnly: boolean) {
  const result = await query(
    `SELECT ${DREAM_ARTICLE_COLUMNS} FROM dream_articles ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function getDreamArticleBySlug(slug: string) {
  const result = await query(`SELECT ${DREAM_ARTICLE_COLUMNS} FROM dream_articles WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createDreamArticle(input: DreamArticleInput) {
  const result = await query(
    `INSERT INTO dream_articles (title, slug, excerpt, body, category, is_published)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, true)) RETURNING ${DREAM_ARTICLE_COLUMNS}`,
    [input.title, input.slug, input.excerpt ?? null, input.body ?? null, input.category ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateDreamArticle(id: string, updates: Partial<DreamArticleInput>) {
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
  values.push(id);
  const result = await query(`UPDATE dream_articles SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${DREAM_ARTICLE_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteDreamArticle(id: string) {
  await query('DELETE FROM dream_articles WHERE id = $1', [id]);
}

// --- Store products ---

export type StoreProductInput = {
  title: string;
  description?: string | null;
  price_display?: string | null;
  selar_url?: string | null;
  cover_image_url?: string | null;
  is_published?: boolean;
};

const STORE_PRODUCT_COLUMNS = 'id, title, description, price_display, selar_url, cover_image_url, is_published, created_at, updated_at';

export async function listStoreProducts(publishedOnly: boolean) {
  const result = await query(
    `SELECT ${STORE_PRODUCT_COLUMNS} FROM store_products ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function createStoreProduct(input: StoreProductInput) {
  const result = await query(
    `INSERT INTO store_products (title, description, price_display, selar_url, cover_image_url, is_published)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, true)) RETURNING ${STORE_PRODUCT_COLUMNS}`,
    [input.title, input.description ?? null, input.price_display ?? null, input.selar_url ?? null, input.cover_image_url ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateStoreProduct(id: string, updates: Partial<StoreProductInput>) {
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
  values.push(id);
  const result = await query(`UPDATE store_products SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${STORE_PRODUCT_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteStoreProduct(id: string) {
  await query('DELETE FROM store_products WHERE id = $1', [id]);
}

// --- Site settings ---

export async function getSiteSetting(key: string) {
  const result = await query('SELECT key, value, updated_at FROM site_settings WHERE key = $1', [key]);
  return result.rows[0] || null;
}

export async function listSiteSettings() {
  const result = await query('SELECT key, value, updated_at FROM site_settings ORDER BY key');
  return result.rows;
}

export async function setSiteSetting(key: string, value: string) {
  const result = await query(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = timezone('utc'::text, now())
     RETURNING key, value, updated_at`,
    [key, value]
  );
  return result.rows[0];
}

export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  const rows = await listSiteSettings();
  const settings = { ...SETTINGS_DEFAULTS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

// --- App secrets (encrypted third-party credentials) ---

export async function getAppSecret(key: string): Promise<string | null> {
  const result = await query('SELECT value_encrypted FROM app_secrets WHERE key = $1', [key]);
  return result.rows[0]?.value_encrypted ?? null;
}

export async function listAppSecretKeys(): Promise<string[]> {
  const result = await query('SELECT key FROM app_secrets');
  return result.rows.map((row: { key: string }) => row.key);
}

export async function setAppSecret(key: string, encryptedValue: string): Promise<void> {
  await query(
    `INSERT INTO app_secrets (key, value_encrypted) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value_encrypted = EXCLUDED.value_encrypted, updated_at = timezone('utc'::text, now())`,
    [key, encryptedValue]
  );
}

export async function deleteAppSecret(key: string): Promise<void> {
  await query('DELETE FROM app_secrets WHERE key = $1', [key]);
}

// --- Dream Lab sessions ---

export type DreamLabSessionInput = {
  dream_id?: string | null;
  prompt: string;
  interpretation?: string | null;
  image_url?: string | null;
};

const DREAM_LAB_COLUMNS = 'id, user_id, dream_id, prompt, interpretation, image_url, created_at';

export async function createDreamLabSession(userId: string, input: DreamLabSessionInput) {
  const result = await query(
    `INSERT INTO dream_lab_sessions (user_id, dream_id, prompt, interpretation, image_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${DREAM_LAB_COLUMNS}`,
    [userId, input.dream_id ?? null, input.prompt, input.interpretation ?? null, input.image_url ?? null]
  );
  return result.rows[0];
}

export async function listDreamLabSessionsByUser(userId: string) {
  const result = await query(`SELECT ${DREAM_LAB_COLUMNS} FROM dream_lab_sessions WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
  return result.rows;
}

export async function updateDreamLabSessionImage(id: string, userId: string, imageUrl: string) {
  const result = await query(
    `UPDATE dream_lab_sessions SET image_url = $1 WHERE id = $2 AND user_id = $3 RETURNING ${DREAM_LAB_COLUMNS}`,
    [imageUrl, id, userId]
  );
  return result.rows[0] || null;
}

// --- Admin overview stats ---

export async function getAdminOverviewStats() {
  const result = await query(`
    SELECT
      (SELECT count(*) FROM users) AS user_count,
      (SELECT count(*) FROM dreams) AS dream_count,
      (SELECT count(*) FROM prayer_journal) AS journal_count,
      (SELECT count(*) FROM contact_messages) AS message_count,
      (SELECT count(*) FROM newsletter_subscriptions WHERE is_subscribed = true) AS newsletter_count,
      (SELECT count(*) FROM courses) AS course_count,
      (SELECT count(*) FROM store_products) AS product_count
  `);
  return result.rows[0];
}

// --- Frameworks (marketing CMS) ---

export type FrameworkInput = {
  slug: string;
  title: string;
  description?: string | null;
  category?: string | null;
  overview?: string | null;
  applications?: string[] | null;
  is_published?: boolean;
};

const FRAMEWORK_COLUMNS = 'id, slug, title, description, category, overview, applications, is_published, created_at, updated_at';

export async function listFrameworks(publishedOnly: boolean): Promise<Framework[]> {
  const result = await query(
    `SELECT ${FRAMEWORK_COLUMNS} FROM frameworks ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY created_at`
  );
  return result.rows;
}

export async function getFrameworkBySlug(slug: string): Promise<Framework | null> {
  const result = await query(`SELECT ${FRAMEWORK_COLUMNS} FROM frameworks WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createFramework(input: FrameworkInput) {
  const result = await query(
    `INSERT INTO frameworks (slug, title, description, category, overview, applications, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true)) RETURNING ${FRAMEWORK_COLUMNS}`,
    [input.slug, input.title, input.description ?? null, input.category ?? null, input.overview ?? null, input.applications ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateFramework(id: string, updates: Partial<FrameworkInput>) {
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
  values.push(id);
  const result = await query(`UPDATE frameworks SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${FRAMEWORK_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteFramework(id: string) {
  await query('DELETE FROM frameworks WHERE id = $1', [id]);
}

// --- Companies (marketing CMS) ---

export type CompanyInput = {
  slug: string;
  name: string;
  description?: string | null;
  category?: string | null;
  tagline?: string | null;
  summary?: string | null;
  highlights?: string[] | null;
  logo_url?: string | null;
  is_published?: boolean;
};

const COMPANY_COLUMNS = 'id, slug, name, description, category, tagline, summary, highlights, logo_url, is_published, created_at, updated_at';

export async function listCompanies(publishedOnly: boolean): Promise<Company[]> {
  const result = await query(
    `SELECT ${COMPANY_COLUMNS} FROM companies ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY created_at`
  );
  return result.rows;
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const result = await query(`SELECT ${COMPANY_COLUMNS} FROM companies WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createCompany(input: CompanyInput) {
  const result = await query(
    `INSERT INTO companies (slug, name, description, category, tagline, summary, highlights, logo_url, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, true)) RETURNING ${COMPANY_COLUMNS}`,
    [input.slug, input.name, input.description ?? null, input.category ?? null, input.tagline ?? null, input.summary ?? null, input.highlights ?? null, input.logo_url ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateCompany(id: string, updates: Partial<CompanyInput>) {
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
  values.push(id);
  const result = await query(`UPDATE companies SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${COMPANY_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteCompany(id: string) {
  await query('DELETE FROM companies WHERE id = $1', [id]);
}

// --- Ideas articles (marketing CMS) ---

export type IdeasArticleInput = {
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  read_time?: string | null;
  published_date?: string | null;
  body?: string[] | null;
  is_published?: boolean;
};

const IDEAS_ARTICLE_COLUMNS = 'id, slug, title, excerpt, category, read_time, published_date, body, is_published, created_at, updated_at';

export async function listIdeasArticles(publishedOnly: boolean): Promise<IdeasArticle[]> {
  const result = await query(
    `SELECT ${IDEAS_ARTICLE_COLUMNS} FROM ideas_articles ${publishedOnly ? 'WHERE is_published = true' : ''} ORDER BY published_date DESC NULLS LAST, created_at DESC`
  );
  return result.rows;
}

export async function getIdeasArticleBySlug(slug: string): Promise<IdeasArticle | null> {
  const result = await query(`SELECT ${IDEAS_ARTICLE_COLUMNS} FROM ideas_articles WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
}

export async function createIdeasArticle(input: IdeasArticleInput) {
  const result = await query(
    `INSERT INTO ideas_articles (slug, title, excerpt, category, read_time, published_date, body, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, true)) RETURNING ${IDEAS_ARTICLE_COLUMNS}`,
    [input.slug, input.title, input.excerpt ?? null, input.category ?? null, input.read_time ?? null, input.published_date ?? null, input.body ?? null, input.is_published ?? null]
  );
  return result.rows[0];
}

export async function updateIdeasArticle(id: string, updates: Partial<IdeasArticleInput>) {
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
  values.push(id);
  const result = await query(`UPDATE ideas_articles SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${IDEAS_ARTICLE_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteIdeasArticle(id: string) {
  await query('DELETE FROM ideas_articles WHERE id = $1', [id]);
}
