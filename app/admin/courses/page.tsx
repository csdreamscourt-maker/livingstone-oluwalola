'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input, Textarea, Button } from '@/components/ui';
import type { Course } from '@/types/database';

const emptyForm = { title: '', slug: '', description: '', price_display: '', selar_url: '', thumbnail_url: '' };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/courses');
    if (res.ok) {
      const data = await res.json();
      setCourses(data.courses);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description ?? '',
      price_display: course.price_display ?? '',
      selar_url: course.selar_url ?? '',
      thumbnail_url: course.thumbnail_url ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to save course');
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (course: Course) => {
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !course.is_published }),
    });
    if (res.ok) await load();
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (editingId === id) cancelEdit();
      await load();
    }
  };

  return (
    <AdminLayout title="Courses">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-midnight-950/10 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-midnight-950">{editingId ? 'Edit course' : 'New course'}</h3>
          {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Slug (e.g. dream-intelligence-101)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Price display (e.g. ₦25,000)" value={form.price_display} onChange={(e) => setForm({ ...form, price_display: e.target.value })} />
            <Input placeholder="Selar checkout URL" value={form.selar_url} onChange={(e) => setForm({ ...form, selar_url: e.target.value })} />
            <Input placeholder="Thumbnail image URL" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
            <div className="flex gap-2">
              <Button type="submit" variant="gold" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create course'}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && courses.length === 0 && <p className="text-sm text-gray-500">No courses yet.</p>}
          {courses.map((course) => (
            <div key={course.id} className="rounded-xl border border-midnight-950/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-midnight-950">{course.title}</p>
                  <p className="text-xs text-gray-500">/{course.slug} · {course.price_display || 'no price set'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => togglePublished(course)} className={`rounded-full px-3 py-1 text-xs font-semibold ${course.is_published ? 'bg-emerald-100 text-emerald-700' : 'border border-midnight-950/15 text-gray-500'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button onClick={() => startEdit(course)} className="rounded-full border border-midnight-950/15 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-midnight-950/30 hover:text-midnight-950">
                    Edit
                  </button>
                  <button onClick={() => remove(course.id)} className="rounded-full p-1.5 text-gray-400 hover:text-red-600">×</button>
                </div>
              </div>
              {course.description && <p className="mt-2 text-sm leading-6 text-gray-600">{course.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
