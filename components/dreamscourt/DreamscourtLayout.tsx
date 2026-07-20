'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDreamscourtWorkspace } from '@/lib/dreamscourt/useDreamscourtWorkspace';
import { DreamscourtContext } from '@/lib/dreamscourt/context';
import {
  Brain,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  PenTool,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/journal', label: 'Journal', icon: PenTool },
  { href: '/dreams', label: 'Dreams', icon: Brain },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function LoadingShell() {
  return (
    <div className="min-h-screen bg-midnight-950 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

export function DreamscourtLayout({ children }: { children: ReactNode }) {
  const workspace = useDreamscourtWorkspace();
  const pathname = usePathname();

  if (workspace.loading) {
    return <LoadingShell />;
  }

  const activeItem = navItems.find((item) => pathname?.startsWith(item.href));

  return (
    <DreamscourtContext.Provider value={workspace}>
      <div className="relative min-h-screen bg-midnight-950 text-white">
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 15% 0%, rgba(176,143,79,0.10) 0%, rgba(15,27,61,0) 60%), radial-gradient(60% 60% at 100% 0%, rgba(44,72,144,0.18) 0%, rgba(15,27,61,0) 60%)',
          }}
        />

        <div className="relative flex min-h-screen flex-col lg:flex-row">
          <aside className="w-full border-b border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:w-64 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/dreamscourt-icon-white.png" alt="" width={470} height={425} className="h-7 w-auto" priority />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">Dreamscourt</p>
                <p className="text-sm font-semibold text-white">Private workspace</p>
              </div>
            </div>

            <nav className="mt-8 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item === activeItem;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? 'bg-white/10 text-gold-200' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              <p className="font-semibold text-white/80">A private sanctuary</p>
              <p className="mt-2 leading-6">Every layer lives inside Dreamscourt so you remain in one calm, immersive space.</p>
            </div>

            <button
              onClick={workspace.logout}
              className="mt-6 flex w-full items-center gap-2 rounded-md border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors duration-200 hover:border-white/25 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </aside>

          <main className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  <span className="h-[5px] w-[5px] rounded-full bg-gold-400" />
                  Dreamscourt workspace
                </span>
                <h2 className="mt-2 text-xl font-semibold text-white">{activeItem?.label ?? 'Dreamscourt'}</h2>
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/60">
                {workspace.user?.email || 'Signed in'}
              </div>
            </div>

            {workspace.error && (
              <div className="mb-6 flex items-start justify-between gap-4 rounded-md border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                <p>{workspace.error}</p>
                <button onClick={() => workspace.setError(null)} aria-label="Dismiss" className="shrink-0 text-red-200/70 hover:text-red-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {children}
          </main>
        </div>
      </div>
    </DreamscourtContext.Provider>
  );
}
