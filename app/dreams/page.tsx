'use client';

import { useMemo, useState } from 'react';
import { Container, Section, Card, Button } from '@/components/ui';
import { getDreamEntries, toggleArchive, toggleFavorite, updateDreamEntry } from '@/lib/dreams';
import { Bookmark, Brain, Search, Sparkles, Archive, Star } from 'lucide-react';

export default function DreamsPage() {
  const [dreams, setDreams] = useState(getDreamEntries());
  const [query, setQuery] = useState('');

  const filteredDreams = useMemo(() => {
    const lowered = query.toLowerCase();
    return dreams.filter((dream) => {
      if (dream.archived) return false;
      return [dream.title, dream.description, dream.tags.join(' '), dream.category]
        .join(' ')
        .toLowerCase()
        .includes(lowered);
    });
  }, [dreams, query]);

  const toggleFavoriteDream = (id: string) => {
    const next = toggleFavorite(id);
    setDreams(next);
  };

  const toggleArchived = (id: string) => {
    const next = toggleArchive(id);
    setDreams(next);
  };

  const markInsight = (dream: (typeof dreams)[number]) => {
    updateDreamEntry({ ...dream, personalNotes: `${dream.personalNotes}\n\nInsight: The dream suggests a season of becoming.` });
    setDreams(getDreamEntries());
  };

  return (
    <Section padding="2xl" className="bg-[radial-gradient(circle_at_top,_rgba(245,214,117,0.16),_transparent_50%)]">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700 mb-4">
              <Bookmark className="w-4 h-4" />
              Dream library
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950">A private archive of memory and meaning</h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Organize your dreams by feeling, theme, and spiritual significance.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dreams"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredDreams.map((dream) => (
              <Card key={dream.id} variant="bordered" className="group hover:border-gold-600">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                        {dream.category}
                      </span>
                      {dream.favorite && (
                        <span className="rounded-full bg-midnight-950/5 px-3 py-1 text-xs font-semibold text-midnight-700">
                          important
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-serif font-bold text-midnight-950">{dream.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{dream.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleFavoriteDream(dream.id)}>
                      <Star className={`mr-2 h-4 w-4 ${dream.favorite ? 'fill-gold-600 text-gold-600' : ''}`} />
                      {dream.favorite ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => toggleArchived(dream.id)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {dream.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-midnight-950">Possible meaning:</span> {dream.possibleMeaning || 'A quiet invitation to reflect further.'}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    {dream.mood} • clarity {dream.clarity}/5
                  </div>
                  <Button variant="gold" size="sm" onClick={() => markInsight(dream)}>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate insight
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card variant="bordered">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">Memory system</p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-midnight-950">Recurring patterns</h2>
              <p className="mt-3 text-sm text-gray-600">Dreamscourt remembers recurring symbols, emotions, and spiritual themes over time.</p>
            </Card>
            <Card variant="bordered">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">Weekly review</p>
              <h2 className="mt-2 text-2xl font-serif font-bold text-midnight-950">A gentle rhythm</h2>
              <p className="mt-3 text-sm text-gray-600">Set aside a few quiet minutes each week to review patterns and growth.</p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
