export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type DreamFolder = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price_display?: string;
  selar_url?: string;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DreamSymbol = {
  id: string;
  term: string;
  meaning: string;
  category?: string;
  scripture_reference?: string;
  created_at: string;
  updated_at: string;
};

export type DreamArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  category?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type StoreProduct = {
  id: string;
  title: string;
  description?: string;
  price_display?: string;
  selar_url?: string;
  cover_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type DreamLabSession = {
  id: string;
  user_id: string;
  dream_id?: string;
  prompt: string;
  interpretation?: string;
  image_url?: string;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value: string;
  updated_at: string;
};

export type Dream = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content?: string;
  date_occurred: string;
  mood?: string;
  tags?: string[];
  voice_recording_url?: string;
  is_private: boolean;
  favorite: boolean;
  is_archived: boolean;
  clarity?: number;
  folder_id?: string;
  created_at: string;
  updated_at: string;
};

export type DreamInterpretation = {
  id: string;
  dream_id: string;
  user_id: string;
  interpretation: string;
  key_themes?: string[];
  symbolic_meanings?: string;
  psychological_insights?: string;
  biblical_references?: string[];
  confidence_score?: number;
  model_used?: string;
  created_at: string;
};

export type RecurringDreamPattern = {
  element_type: 'person' | 'place' | 'number' | 'color' | 'symbol' | 'emotion';
  value: string;
  occurrences: number;
  dream_titles: string[];
  last_seen: string;
};

export type PrayerJournalEntry = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prayer_type?: 'intercession' | 'thanksgiving' | 'petition' | 'praise' | 'confession';
  date_prayed: string;
  tags?: string[];
  is_answered: boolean;
  answer_date?: string;
  answer_notes?: string;
  created_at: string;
  updated_at: string;
};

export type BiblicalReference = {
  id: string;
  dream_id: string;
  book: string;
  chapter: number;
  verse: number;
  text?: string;
  relevance_explanation?: string;
  created_at: string;
};

export type PrayerRecommendation = {
  id: string;
  dream_id: string;
  user_id: string;
  prayer_focus: string;
  suggested_scripture?: string;
  action_items?: string[];
  created_at: string;
};

export type DreamInsight = {
  id: string;
  dream_id: string;
  user_id: string;
  insight_type?: 'personal' | 'spiritual' | 'psychological';
  content: string;
  created_at: string;
  updated_at: string;
};

export type DreamTag = {
  id: string;
  user_id: string;
  tag_name: string;
  color?: string;
  created_at: string;
};

export type UserAnalytics = {
  id: string;
  user_id: string;
  total_dreams: number;
  dreams_this_month: number;
  prayers_recorded: number;
  streak_days: number;
  last_dream_date?: string;
  last_prayer_date?: string;
  total_insights: number;
  updated_at: string;
};

export type DailyReflection = {
  id: string;
  user_id: string;
  date: string;
  reflection_prompt?: string;
  user_response?: string;
  mood_rating?: number;
  gratitude_items?: string[];
  challenges?: string[];
  created_at: string;
  updated_at: string;
};

export type SavedFramework = {
  id: string;
  user_id: string;
  framework_id: string;
  framework_title?: string;
  notes?: string;
  is_favorited: boolean;
  created_at: string;
};

export type Framework = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  overview?: string;
  applications?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  tagline?: string;
  summary?: string;
  highlights?: string[];
  logo_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type IdeasArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  read_time?: string;
  published_date?: string;
  body?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type AiProviderKind = 'openai' | 'anthropic' | 'google' | 'nvidia' | 'custom';

export type AiProvider = {
  id: string;
  slug: string;
  name: string;
  kind: AiProviderKind;
  base_url?: string;
  api_key_encrypted?: string;
  enabled: boolean;
  last_tested_at?: string;
  last_test_ok?: boolean;
  last_test_message?: string;
  created_at: string;
  updated_at: string;
};

export type AiModel = {
  id: string;
  provider_id: string;
  model_id: string;
  display_name: string;
  supports_text: boolean;
  supports_vision: boolean;
  supports_image_generation: boolean;
  supports_embeddings: boolean;
  context_window?: number;
  cost_tier?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type AiModelWithProvider = AiModel & {
  provider_slug: string;
  provider_name: string;
  provider_kind: AiProviderKind;
};

export type AiTaskAssignment = {
  task_key: string;
  primary_model_id?: string;
  fallback_model_ids: string[];
  updated_at: string;
};

export type KnowledgeSourceType = 'book' | 'journal' | 'article' | 'sermon' | 'video_transcript' | 'audio_transcript' | 'social_post' | 'document';
export type KnowledgeProcessingStatus = 'pending' | 'processing' | 'indexed' | 'published' | 'failed' | 'needs_review';

export type KnowledgeSource = {
  id: string;
  title: string;
  author?: string;
  source_type: KnowledgeSourceType;
  tier: number;
  publication_date?: string;
  url?: string;
  description?: string;
  full_text?: string;
  topics?: string[];
  tags?: string[];
  scripture_references?: string[];
  framework_categories?: string[];
  processing_status: KnowledgeProcessingStatus;
  processing_error?: string;
  version: number;
  created_at: string;
  updated_at: string;
};

export type KnowledgeChunkMatch = {
  id: string;
  source_id: string;
  chunk_index: number;
  content: string;
  page?: number;
  chapter?: string;
  similarity: number;
  source_title: string;
  source_author?: string;
  source_type: KnowledgeSourceType;
  source_tier: number;
};

export type AiPromptSlot = {
  key: string;
  label: string;
  description?: string;
  published_version_id?: string;
  created_at: string;
  updated_at: string;
};

export type AiPromptVersion = {
  id: string;
  slot_key: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author?: string;
  created_at: string;
};

export type NewsletterSubscription = {
  id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
};
