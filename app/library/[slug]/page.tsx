'use client';

import { use } from 'react';
import { DreamscourtLayout } from '@/components/dreamscourt/DreamscourtLayout';
import { LibraryArticleView } from '@/components/dreamscourt/views/LibraryArticleView';

export default function LibraryArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <DreamscourtLayout>
      <LibraryArticleView slug={slug} />
    </DreamscourtLayout>
  );
}
