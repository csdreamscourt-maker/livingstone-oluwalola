'use client';

import { use } from 'react';
import { DreamscourtLayout } from '@/components/dreamscourt/DreamscourtLayout';
import { AcademyDetailView } from '@/components/dreamscourt/views/AcademyDetailView';

export default function AcademyCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <DreamscourtLayout>
      <AcademyDetailView slug={slug} />
    </DreamscourtLayout>
  );
}
