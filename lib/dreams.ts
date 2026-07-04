export type DreamEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
  clarity: number;
  mood: string;
  category: string;
  tags: string[];
  people: string[];
  locations: string[];
  symbols: string[];
  personalNotes: string;
  possibleMeaning: string;
  spiritualReflection: string;
  lessonsLearned: string;
  actionPoints: string[];
  favorite: boolean;
  archived: boolean;
};

const STORAGE_KEY = 'dreamscourt-dreams';

const sampleDreams: DreamEntry[] = [
  {
    id: 'dream-1',
    title: 'The River of Light',
    description:
      'I found myself walking beside a calm river that glowed softly at dusk. Each step revealed a new memory and a sense of peace.',
    date: '2026-07-01T07:20:00',
    clarity: 5,
    mood: 'peaceful',
    category: 'spiritual',
    tags: ['river', 'guidance', 'peace'],
    people: ['myself'],
    locations: ['garden path'],
    symbols: ['river', 'light'],
    personalNotes: 'The dream felt grounding and deeply restorative.',
    possibleMeaning: 'A reminder to move more gently through life and trust your inner compass.',
    spiritualReflection: 'I felt invited to remain still and listen.',
    lessonsLearned: 'Stillness can be a source of clarity.',
    actionPoints: ['Journal for ten minutes tonight', 'Take a sabbath walk this weekend'],
    favorite: true,
    archived: false,
  },
  {
    id: 'dream-2',
    title: 'The House of Open Windows',
    description:
      'A large house appeared with every window open, and air moved through each room with warmth and ease.',
    date: '2026-06-28T06:55:00',
    clarity: 4,
    mood: 'hopeful',
    category: 'growth',
    tags: ['home', 'opportunity', 'release'],
    people: ['mentor'],
    locations: ['house'],
    symbols: ['windows', 'air'],
    personalNotes: 'The dream felt spacious, almost like permission.',
    possibleMeaning: 'A season of openness and emotional release.',
    spiritualReflection: 'What am I ready to receive?',
    lessonsLearned: 'A softened heart creates room for new insight.',
    actionPoints: ['Pray for clarity', 'Declutter one corner of my room'],
    favorite: false,
    archived: false,
  },
];

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `dream-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDreamEntries(): DreamEntry[] {
  if (typeof window === 'undefined') {
    return sampleDreams;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDreams));
      return sampleDreams;
    }

    const parsed = JSON.parse(raw) as DreamEntry[];
    return parsed.length ? parsed : sampleDreams;
  } catch {
    return sampleDreams;
  }
}

export function saveDreamEntries(entries: DreamEntry[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addDreamEntry(entry: Omit<DreamEntry, 'id' | 'favorite' | 'archived'>) {
  const dream: DreamEntry = {
    ...entry,
    id: createId(),
    favorite: false,
    archived: false,
  };

  const entries = [dream, ...getDreamEntries()];
  saveDreamEntries(entries);
  return dream;
}

export function updateDreamEntry(updated: DreamEntry) {
  const entries = getDreamEntries().map((entry) => (entry.id === updated.id ? updated : entry));
  saveDreamEntries(entries);
  return updated;
}

export function toggleFavorite(id: string) {
  const entries = getDreamEntries().map((entry) =>
    entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
  );
  saveDreamEntries(entries);
  return entries;
}

export function toggleArchive(id: string) {
  const entries = getDreamEntries().map((entry) =>
    entry.id === id ? { ...entry, archived: !entry.archived } : entry
  );
  saveDreamEntries(entries);
  return entries;
}

export function getDreamStats(entries: DreamEntry[]) {
  const moods = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const categories = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {});

  const recurringThemes = Array.from(
    new Set(entries.flatMap((entry) => entry.tags))
  ).slice(0, 6);

  return {
    dreamCount: entries.length,
    favoriteCount: entries.filter((entry) => entry.favorite).length,
    archivedCount: entries.filter((entry) => entry.archived).length,
    averageClarity: entries.length
      ? Math.round((entries.reduce((acc, entry) => acc + entry.clarity, 0) / entries.length) * 10) / 10
      : 0,
    moods,
    categories,
    recurringThemes,
  };
}
