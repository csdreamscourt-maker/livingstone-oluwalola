'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

const standalonePrefixes = ['/dashboard', '/journal', '/dreams', '/settings', '/auth'];

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '/';
  const isStandalone = standalonePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  return (
    <>
      {!isStandalone && <Header />}
      <main className="flex-1">{children}</main>
      {!isStandalone && <Footer />}
    </>
  );
}
