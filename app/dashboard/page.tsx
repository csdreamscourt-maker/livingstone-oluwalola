'use client';

import { DreamscourtLayout } from '@/components/dreamscourt/DreamscourtLayout';
import { OverviewView } from '@/components/dreamscourt/views/OverviewView';

export default function DashboardPage() {
  return (
    <DreamscourtLayout>
      <OverviewView />
    </DreamscourtLayout>
  );
}
