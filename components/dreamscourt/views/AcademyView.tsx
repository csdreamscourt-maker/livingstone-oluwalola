'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eyebrow, GlassCard } from '../ui';
import { ArrowUpRight, GraduationCap } from 'lucide-react';
import type { Course } from '@/types/database';

export function AcademyView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <GlassCard>
        <Eyebrow>DC Academy</Eyebrow>
        <h1 className="mt-3 text-2xl font-semibold text-midnight-950">Structured courses in dream intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Cohort-based courses and seasonal live classes equipping you with the principles, frameworks, and disciplines
          of dream intelligence.
        </p>
      </GlassCard>

      {loading && <p className="text-sm text-gray-500">Loading courses...</p>}
      {!loading && courses.length === 0 && (
        <GlassCard>
          <p className="text-sm text-gray-500">No courses published yet — check back soon.</p>
        </GlassCard>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/academy/${course.slug}`} className="group flex h-full flex-col gap-3 rounded-xl border border-midnight-950/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-midnight-950/20">
            <div className="flex items-center gap-2 text-gold-700">
              <GraduationCap className="h-4 w-4" />
              {course.price_display && <span className="text-xs font-semibold uppercase tracking-[0.1em]">{course.price_display}</span>}
            </div>
            <h3 className="text-[15px] font-semibold text-midnight-950">{course.title}</h3>
            {course.description && <p className="line-clamp-3 text-sm leading-6 text-gray-600">{course.description}</p>}
            <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-gray-700 group-hover:text-midnight-950">
              View course
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
