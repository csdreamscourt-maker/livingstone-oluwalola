'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eyebrow, GlassCard } from '../ui';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Course } from '@/types/database';

export function AcademyDetailView({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/courses/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  if (notFound || !course) {
    return (
      <GlassCard>
        <p className="text-sm text-gray-600">Course not found.</p>
        <Link href="/academy" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Academy
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/academy" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-midnight-950">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Academy
      </Link>

      <GlassCard>
        <Eyebrow>DC Academy</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-midnight-950">{course.title}</h1>
        {course.description && <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">{course.description}</p>}

        {course.selar_url ? (
          <a
            href={course.selar_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-semibold text-midnight-950 transition-all duration-200 hover:scale-[1.03] hover:bg-gold-400"
          >
            {course.price_display ? `Enroll — ${course.price_display}` : 'Enroll now'}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <p className="mt-6 text-sm text-gray-500">Enrollment link coming soon.</p>
        )}
      </GlassCard>
    </div>
  );
}
