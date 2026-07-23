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

export type NewsletterSubscription = {
  id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
};
