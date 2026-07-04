'use client';

import { useMemo, useState } from 'react';
import { Container, Section, Card, Button } from '@/components/ui';
import { addDreamEntry, getDreamEntries } from '@/lib/dreams';
import { BookOpen, Sparkles, PenSquare, MoonStar } from 'lucide-react';

export default function JournalPage() {
  const [dreams, setDreams] = useState(getDreamEntries());
  const [form, setForm] = useState({
    title: '',
    description: '',
    mood: '',
    category: '',
    tags: '',
    notes: '',
  });

  const stats = useMemo(() => ({
    total: dreams.length,
    favorite: dreams.filter((dream) => dream.favorite).length,
  }), [dreams]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    addDreamEntry({
      title: form.title,
      description: form.description,
      date: new Date().toISOString(),
      clarity: 4,
      mood: form.mood || 'reflective',
      category: form.category || 'spiritual',
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      people: [],
      locations: [],
      symbols: [],
      personalNotes: form.notes,
      possibleMeaning: '',
      spiritualReflection: '',
      lessonsLearned: '',
      actionPoints: [],
    });

    setDreams(getDreamEntries());
    setForm({ title: '', description: '', mood: '', category: '', tags: '', notes: '' });
  };

  return (
    <Section padding="2xl" className="bg-[radial-gradient(circle_at_top,_rgba(245,214,117,0.18),_transparent_50%)]">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-600/20 bg-gold-50 px-3 py-1 text-sm font-semibold text-gold-700 mb-4">
            <PenSquare className="w-4 h-4" />
            Dreamscourt journal
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950">Write the dream before it fades</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">Capture the image, the feeling, and the meaning in a space designed for calm, memory, and reflection.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
          <Card variant="bordered" className="h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-2xl bg-gold-50 p-3 text-gold-700"><BookOpen className="w-5 h-5" /></div>
              <div>
                <p className="text-sm font-semibold text-gold-700">Journal overview</p>
                <p className="text-sm text-gray-600">Your practice at a glance</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-midnight-950 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-gold-400">Entries</p>
                <p className="mt-2 text-3xl font-serif font-semibold">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="text-sm font-semibold text-midnight-950">Saved favorites</p>
                <p className="mt-2 text-2xl font-serif font-semibold text-gold-700">{stats.favorite}</p>
              </div>
            </div>
          </Card>

          <Card variant="bordered">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-midnight-950">Title</label>
                  <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="The hallway of stars" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-midnight-950">Mood</label>
                  <input value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="peaceful" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-midnight-950">Dream description</label>
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-[140px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="Describe the dream as clearly as you can while it is still fresh." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-midnight-950">Category</label>
                  <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="spiritual" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-midnight-950">Tags</label>
                  <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="river, guidance, peace" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-midnight-950">Notes for reflection</label>
                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-[100px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-gold-600" placeholder="What stood out? What felt important?" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MoonStar className="w-4 h-4 text-gold-600" />
                  A calm practice for memory and meaning
                </div>
                <Button type="submit" variant="gold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save entry
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
