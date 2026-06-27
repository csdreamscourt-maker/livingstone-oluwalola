export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
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

export type NewsletterSubscription = {
  id: string;
  email: string;
  is_subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
};
