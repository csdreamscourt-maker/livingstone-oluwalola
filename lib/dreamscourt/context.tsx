'use client';

import { createContext, useContext } from 'react';
import type { DreamscourtWorkspace } from './useDreamscourtWorkspace';

export const DreamscourtContext = createContext<DreamscourtWorkspace | null>(null);

export function useDreamscourt(): DreamscourtWorkspace {
  const ctx = useContext(DreamscourtContext);
  if (!ctx) {
    throw new Error('useDreamscourt must be used within a DreamscourtLayout');
  }
  return ctx;
}
