import { supabase } from '@/lib/supabase/client';
import type { Dream, DreamInterpretation, PrayerJournalEntry, DailyReflection } from '@/types/database';

export async function getDreams(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('date_occurred', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Dream[];
}

export async function getDreamById(dreamId: string) {
  const { data, error } = await supabase
    .from('dreams')
    .select('*')
    .eq('id', dreamId)
    .single();

  if (error) throw error;
  return data as Dream;
}

export async function createDream(dream: Omit<Dream, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('dreams')
    .insert([dream])
    .select()
    .single();

  if (error) throw error;
  return data as Dream;
}

export async function updateDream(dreamId: string, updates: Partial<Dream>) {
  const { data, error } = await supabase
    .from('dreams')
    .update(updates)
    .eq('id', dreamId)
    .select()
    .single();

  if (error) throw error;
  return data as Dream;
}

export async function deleteDream(dreamId: string) {
  const { error } = await supabase.from('dreams').delete().eq('id', dreamId);

  if (error) throw error;
}

export async function getDreamInterpretation(dreamId: string) {
  const { data, error } = await supabase
    .from('dream_interpretations')
    .select('*')
    .eq('dream_id', dreamId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as DreamInterpretation | null;
}

export async function createDreamInterpretation(
  interpretation: Omit<DreamInterpretation, 'id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('dream_interpretations')
    .insert([interpretation])
    .select()
    .single();

  if (error) throw error;
  return data as DreamInterpretation;
}

export async function getPrayerJournal(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('prayer_journal')
    .select('*')
    .eq('user_id', userId)
    .order('date_prayed', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as PrayerJournalEntry[];
}

export async function createPrayerEntry(entry: Omit<PrayerJournalEntry, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('prayer_journal')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data as PrayerJournalEntry;
}

export async function getDailyReflection(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_reflections')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as DailyReflection | null;
}

export async function createDailyReflection(reflection: Omit<DailyReflection, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('daily_reflections')
    .insert([reflection])
    .select()
    .single();

  if (error) throw error;
  return data as DailyReflection;
}

export async function updateDailyReflection(
  reflectionId: string,
  updates: Partial<DailyReflection>
) {
  const { data, error } = await supabase
    .from('daily_reflections')
    .update(updates)
    .eq('id', reflectionId)
    .select()
    .single();

  if (error) throw error;
  return data as DailyReflection;
}
