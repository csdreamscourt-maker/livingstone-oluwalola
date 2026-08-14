import { Pool } from 'pg';
import type { Framework, Company, IdeasArticle, AiProvider, AiModel, AiModelWithProvider, AiTaskAssignment, KnowledgeSource, KnowledgeChunkMatch, AiPromptSlot, AiPromptVersion } from '@/types/database';
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
      (SELECT count(*) FROM store_products) AS product_count,
      (SELECT count(*) FROM dream_lab_sessions) AS dream_lab_session_count,
      (SELECT count(*) FROM knowledge_sources) AS knowledge_source_count,
      (SELECT count(*) FROM knowledge_sources WHERE processing_status = 'published') AS knowledge_published_count,
      (SELECT count(*) FROM knowledge_sources WHERE processing_status IN ('needs_review', 'indexed')) AS knowledge_pending_review_count,
      (SELECT count(*) FROM knowledge_sources WHERE processing_status = 'failed') AS knowledge_failed_count,
      (SELECT count(*) FROM ai_providers WHERE enabled = true) AS ai_provider_count,
      (SELECT count(*) FROM ai_usage_logs WHERE created_at > now() - interval '24 hours') AS ai_requests_today,
      (SELECT count(*) FROM ai_usage_logs WHERE created_at > now() - interval '24 hours' AND success = false) AS ai_errors_today
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

// --- AI provider control center ---

export type AiProviderInput = {
  slug: string;
  name: string;
  kind: 'openai' | 'anthropic' | 'google' | 'nvidia' | 'custom';
  base_url?: string | null;
  api_key_encrypted?: string | null;
  enabled?: boolean;
};

const AI_PROVIDER_COLUMNS =
  'id, slug, name, kind, base_url, api_key_encrypted, enabled, last_tested_at, last_test_ok, last_test_message, created_at, updated_at';

export async function listAiProviders(): Promise<AiProvider[]> {
  const result = await query(`SELECT ${AI_PROVIDER_COLUMNS} FROM ai_providers ORDER BY created_at`);
  return result.rows;
}

export async function getAiProviderById(id: string): Promise<AiProvider | null> {
  const result = await query(`SELECT ${AI_PROVIDER_COLUMNS} FROM ai_providers WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function createAiProvider(input: AiProviderInput): Promise<AiProvider> {
  const result = await query(
    `INSERT INTO ai_providers (slug, name, kind, base_url, api_key_encrypted, enabled)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, true)) RETURNING ${AI_PROVIDER_COLUMNS}`,
    [input.slug, input.name, input.kind, input.base_url ?? null, input.api_key_encrypted ?? null, input.enabled ?? null]
  );
  return result.rows[0];
}

type AiProviderUpdates = Partial<AiProviderInput> & {
  last_tested_at?: string;
  last_test_ok?: boolean;
  last_test_message?: string;
};

export async function updateAiProvider(id: string, updates: AiProviderUpdates): Promise<AiProvider | null> {
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
  const result = await query(`UPDATE ai_providers SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${AI_PROVIDER_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteAiProvider(id: string): Promise<void> {
  await query('DELETE FROM ai_providers WHERE id = $1', [id]);
}

export type AiModelInput = {
  provider_id: string;
  model_id: string;
  display_name: string;
  supports_text?: boolean;
  supports_vision?: boolean;
  supports_image_generation?: boolean;
  supports_embeddings?: boolean;
  context_window?: number | null;
  cost_tier?: string | null;
  enabled?: boolean;
};

const AI_MODEL_COLUMNS =
  'id, provider_id, model_id, display_name, supports_text, supports_vision, supports_image_generation, supports_embeddings, context_window, cost_tier, enabled, created_at, updated_at';

export async function listAiModels(): Promise<AiModelWithProvider[]> {
  const result = await query(
    `SELECT m.id, m.provider_id, m.model_id, m.display_name, m.supports_text, m.supports_vision,
            m.supports_image_generation, m.supports_embeddings, m.context_window, m.cost_tier, m.enabled,
            m.created_at, m.updated_at, p.slug as provider_slug, p.name as provider_name, p.kind as provider_kind
     FROM ai_models m JOIN ai_providers p ON p.id = m.provider_id
     ORDER BY m.created_at`
  );
  return result.rows;
}

export async function createAiModel(input: AiModelInput): Promise<AiModel> {
  const result = await query(
    `INSERT INTO ai_models (provider_id, model_id, display_name, supports_text, supports_vision, supports_image_generation, supports_embeddings, context_window, cost_tier, enabled)
     VALUES ($1, $2, $3, COALESCE($4, true), COALESCE($5, false), COALESCE($6, false), COALESCE($7, false), $8, $9, COALESCE($10, true))
     RETURNING ${AI_MODEL_COLUMNS}`,
    [
      input.provider_id,
      input.model_id,
      input.display_name,
      input.supports_text ?? null,
      input.supports_vision ?? null,
      input.supports_image_generation ?? null,
      input.supports_embeddings ?? null,
      input.context_window ?? null,
      input.cost_tier ?? null,
      input.enabled ?? null,
    ]
  );
  return result.rows[0];
}

export async function updateAiModel(id: string, updates: Partial<AiModelInput>): Promise<AiModel | null> {
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
  const result = await query(`UPDATE ai_models SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${AI_MODEL_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteAiModel(id: string): Promise<void> {
  await query('DELETE FROM ai_models WHERE id = $1', [id]);
}

export type AiModelWithProviderSecret = {
  id: string;
  model_id: string;
  model_enabled: boolean;
  supports_image_generation: boolean;
  provider_slug: string;
  provider_name: string;
  provider_kind: string;
  base_url: string | null;
  api_key_encrypted: string | null;
  provider_enabled: boolean;
};

export async function getAiModelWithProvider(modelId: string): Promise<AiModelWithProviderSecret | null> {
  const result = await query(
    `SELECT m.id, m.model_id, m.enabled as model_enabled, m.supports_image_generation,
            p.slug as provider_slug, p.name as provider_name, p.kind as provider_kind,
            p.base_url, p.api_key_encrypted, p.enabled as provider_enabled
     FROM ai_models m JOIN ai_providers p ON p.id = m.provider_id
     WHERE m.id = $1`,
    [modelId]
  );
  return result.rows[0] || null;
}

export async function getAiTaskAssignment(taskKey: string): Promise<AiTaskAssignment | null> {
  const result = await query(
    'SELECT task_key, primary_model_id, fallback_model_ids, updated_at FROM ai_task_assignments WHERE task_key = $1',
    [taskKey]
  );
  return result.rows[0] || null;
}

export async function listAiTaskAssignments(): Promise<AiTaskAssignment[]> {
  const result = await query('SELECT task_key, primary_model_id, fallback_model_ids, updated_at FROM ai_task_assignments ORDER BY task_key');
  return result.rows;
}

export async function setAiTaskAssignment(
  taskKey: string,
  primaryModelId: string | null,
  fallbackModelIds: string[]
): Promise<AiTaskAssignment> {
  const result = await query(
    `INSERT INTO ai_task_assignments (task_key, primary_model_id, fallback_model_ids)
     VALUES ($1, $2, $3)
     ON CONFLICT (task_key) DO UPDATE SET primary_model_id = EXCLUDED.primary_model_id, fallback_model_ids = EXCLUDED.fallback_model_ids, updated_at = timezone('utc'::text, now())
     RETURNING task_key, primary_model_id, fallback_model_ids, updated_at`,
    [taskKey, primaryModelId, fallbackModelIds]
  );
  return result.rows[0];
}

// --- Founder Knowledge Engine ---

export type KnowledgeSourceInput = {
  title: string;
  author?: string | null;
  source_type: string;
  tier?: number;
  publication_date?: string | null;
  url?: string | null;
  description?: string | null;
  full_text?: string | null;
  topics?: string[] | null;
  tags?: string[] | null;
  scripture_references?: string[] | null;
  framework_categories?: string[] | null;
};

const KNOWLEDGE_SOURCE_COLUMNS =
  'id, title, author, source_type, tier, publication_date, url, description, full_text, topics, tags, scripture_references, framework_categories, processing_status, processing_error, version, created_at, updated_at';

const KNOWLEDGE_SOURCE_LIST_COLUMNS =
  's.id, s.title, s.author, s.source_type, s.tier, s.publication_date, s.url, s.description, s.topics, s.tags, s.scripture_references, s.framework_categories, s.processing_status, s.processing_error, s.version, s.created_at, s.updated_at';

export async function listKnowledgeSources(): Promise<(KnowledgeSource & { chunk_count: number })[]> {
  const result = await query(
    `SELECT ${KNOWLEDGE_SOURCE_LIST_COLUMNS}, count(c.id)::int as chunk_count
     FROM knowledge_sources s
     LEFT JOIN knowledge_chunks c ON c.source_id = s.id
     GROUP BY s.id
     ORDER BY s.created_at DESC`
  );
  return result.rows;
}

export async function getKnowledgeSourceById(id: string): Promise<KnowledgeSource | null> {
  const result = await query(`SELECT ${KNOWLEDGE_SOURCE_COLUMNS} FROM knowledge_sources WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function createKnowledgeSource(input: KnowledgeSourceInput): Promise<KnowledgeSource> {
  const result = await query(
    `INSERT INTO knowledge_sources (title, author, source_type, tier, publication_date, url, description, full_text, topics, tags, scripture_references, framework_categories)
     VALUES ($1, $2, $3, COALESCE($4, 1), $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING ${KNOWLEDGE_SOURCE_COLUMNS}`,
    [
      input.title,
      input.author ?? null,
      input.source_type,
      input.tier ?? null,
      input.publication_date ?? null,
      input.url ?? null,
      input.description ?? null,
      input.full_text ?? null,
      input.topics ?? null,
      input.tags ?? null,
      input.scripture_references ?? null,
      input.framework_categories ?? null,
    ]
  );
  return result.rows[0];
}

type KnowledgeSourceUpdates = Partial<KnowledgeSourceInput> & {
  processing_status?: string;
  processing_error?: string | null;
};

export async function updateKnowledgeSource(id: string, updates: KnowledgeSourceUpdates): Promise<KnowledgeSource | null> {
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
  const result = await query(`UPDATE knowledge_sources SET ${fields.join(', ')} WHERE id = $${i} RETURNING ${KNOWLEDGE_SOURCE_COLUMNS}`, values);
  return result.rows[0] || null;
}

export async function deleteKnowledgeSource(id: string): Promise<void> {
  await query('DELETE FROM knowledge_sources WHERE id = $1', [id]);
}

function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

export async function deleteKnowledgeChunksForSource(sourceId: string): Promise<void> {
  await query('DELETE FROM knowledge_chunks WHERE source_id = $1', [sourceId]);
}

export async function insertKnowledgeChunk(
  sourceId: string,
  chunkIndex: number,
  content: string,
  embedding: number[],
  page?: number | null,
  chapter?: string | null
): Promise<void> {
  await query(
    `INSERT INTO knowledge_chunks (source_id, chunk_index, content, page, chapter, embedding)
     VALUES ($1, $2, $3, $4, $5, $6::vector)`,
    [sourceId, chunkIndex, content, page ?? null, chapter ?? null, toVectorLiteral(embedding)]
  );
}

export async function countKnowledgeChunksForSource(sourceId: string): Promise<number> {
  const result = await query('SELECT count(*)::int as count FROM knowledge_chunks WHERE source_id = $1', [sourceId]);
  return result.rows[0]?.count ?? 0;
}

export async function searchKnowledgeChunks(
  queryEmbedding: number[],
  limit: number,
  includeUnpublished = false
): Promise<KnowledgeChunkMatch[]> {
  const result = await query(
    `SELECT c.id, c.source_id, c.chunk_index, c.content, c.page, c.chapter,
            1 - (c.embedding <=> $1::vector) as similarity,
            s.title as source_title, s.author as source_author, s.source_type, s.tier as source_tier
     FROM knowledge_chunks c
     JOIN knowledge_sources s ON s.id = c.source_id
     ${includeUnpublished ? '' : "WHERE s.processing_status = 'published'"}
     ORDER BY c.embedding <=> $1::vector
     LIMIT $2`,
    [toVectorLiteral(queryEmbedding), limit]
  );
  return result.rows;
}

// --- AI prompt management (versioned, admin-editable system prompts) ---

export async function listAiPromptSlots(): Promise<AiPromptSlot[]> {
  const result = await query('SELECT key, label, description, published_version_id, created_at, updated_at FROM ai_prompt_slots ORDER BY key');
  return result.rows;
}

export async function getAiPromptSlot(key: string): Promise<AiPromptSlot | null> {
  const result = await query('SELECT key, label, description, published_version_id, created_at, updated_at FROM ai_prompt_slots WHERE key = $1', [key]);
  return result.rows[0] || null;
}

export async function ensureAiPromptSlot(key: string, label: string, description?: string): Promise<AiPromptSlot> {
  const result = await query(
    `INSERT INTO ai_prompt_slots (key, label, description) VALUES ($1, $2, $3)
     ON CONFLICT (key) DO NOTHING
     RETURNING key, label, description, published_version_id, created_at, updated_at`,
    [key, label, description ?? null]
  );
  if (result.rows[0]) return result.rows[0];
  const existing = await getAiPromptSlot(key);
  if (!existing) throw new Error(`Failed to ensure prompt slot ${key}`);
  return existing;
}

export async function getPublishedPromptContent(key: string): Promise<string | null> {
  const result = await query(
    `SELECT v.content FROM ai_prompt_slots s
     JOIN ai_prompt_versions v ON v.id = s.published_version_id
     WHERE s.key = $1`,
    [key]
  );
  return result.rows[0]?.content ?? null;
}

export async function listAiPromptVersions(slotKey: string): Promise<AiPromptVersion[]> {
  const result = await query(
    'SELECT id, slot_key, content, status, author, created_at FROM ai_prompt_versions WHERE slot_key = $1 ORDER BY created_at DESC',
    [slotKey]
  );
  return result.rows;
}

export async function createAiPromptVersion(slotKey: string, content: string, author?: string | null): Promise<AiPromptVersion> {
  const result = await query(
    `INSERT INTO ai_prompt_versions (slot_key, content, status, author) VALUES ($1, $2, 'draft', $3)
     RETURNING id, slot_key, content, status, author, created_at`,
    [slotKey, content, author ?? null]
  );
  return result.rows[0];
}

export async function publishAiPromptVersion(slotKey: string, versionId: string): Promise<AiPromptSlot> {
  await query(`UPDATE ai_prompt_versions SET status = 'archived' WHERE slot_key = $1 AND status = 'published'`, [slotKey]);
  await query(`UPDATE ai_prompt_versions SET status = 'published' WHERE id = $1 AND slot_key = $2`, [versionId, slotKey]);
  const result = await query(
    `UPDATE ai_prompt_slots SET published_version_id = $1, updated_at = timezone('utc'::text, now()) WHERE key = $2
     RETURNING key, label, description, published_version_id, created_at, updated_at`,
    [versionId, slotKey]
  );
  return result.rows[0];
}

export async function deleteAiPromptVersion(versionId: string): Promise<void> {
  await query(`DELETE FROM ai_prompt_versions WHERE id = $1 AND status != 'published'`, [versionId]);
}

// --- AI usage observability ---

export type AiUsageLogInput = {
  task_key: string;
  provider: string;
  model: string;
  success: boolean;
  used_fallback: boolean;
  latency_ms: number;
  error_message?: string | null;
};

export async function logAiUsage(input: AiUsageLogInput): Promise<void> {
  try {
    await query(
      `INSERT INTO ai_usage_logs (task_key, provider, model, success, used_fallback, latency_ms, error_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [input.task_key, input.provider, input.model, input.success, input.used_fallback, input.latency_ms, input.error_message ?? null]
    );
  } catch (error) {
    // Logging must never break the actual AI call it's observing.
    console.error('Failed to write AI usage log (non-fatal):', error instanceof Error ? error.message : error);
  }
}

export type AiUsageSummary = {
  total: number;
  successes: number;
  failures: number;
  fallback_uses: number;
  avg_latency_ms: number;
  by_task: { task_key: string; total: number; successes: number }[];
  by_provider: { provider: string; total: number; successes: number }[];
};

export async function getAiUsageSummary(sinceHours: number): Promise<AiUsageSummary> {
  const totals = await query(
    `SELECT count(*)::int as total,
            count(*) filter (where success)::int as successes,
            count(*) filter (where not success)::int as failures,
            count(*) filter (where used_fallback)::int as fallback_uses,
            coalesce(avg(latency_ms), 0)::int as avg_latency_ms
     FROM ai_usage_logs WHERE created_at > now() - ($1 || ' hours')::interval`,
    [sinceHours]
  );
  const byTask = await query(
    `SELECT task_key, count(*)::int as total, count(*) filter (where success)::int as successes
     FROM ai_usage_logs WHERE created_at > now() - ($1 || ' hours')::interval
     GROUP BY task_key ORDER BY total DESC`,
    [sinceHours]
  );
  const byProvider = await query(
    `SELECT provider, count(*)::int as total, count(*) filter (where success)::int as successes
     FROM ai_usage_logs WHERE created_at > now() - ($1 || ' hours')::interval
     GROUP BY provider ORDER BY total DESC`,
    [sinceHours]
  );
  const row = totals.rows[0] ?? { total: 0, successes: 0, failures: 0, fallback_uses: 0, avg_latency_ms: 0 };
  return { ...row, by_task: byTask.rows, by_provider: byProvider.rows };
}

export async function listRecentAiUsage(limit: number) {
  const result = await query(
    `SELECT id, task_key, provider, model, success, used_fallback, latency_ms, error_message, created_at
     FROM ai_usage_logs ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function purgeAiUsageLogsOlderThan(days: number): Promise<number> {
  const result = await query(`DELETE FROM ai_usage_logs WHERE created_at < now() - ($1 || ' days')::interval`, [days]);
  return result.rowCount ?? 0;
}
