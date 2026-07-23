'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDreamscourtWorkspace } from '@/lib/dreamscourt/useDreamscourtWorkspace';
import { DreamscourtContext } from '@/lib/dreamscourt/context';
import {
  BookOpen,
  Brain,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageCircle,
  PenTool,
  Settings,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Practice',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/lab', label: 'Dream Lab', icon: Sparkles },
      { href: '/dreams', label: 'Dreams', icon: Brain },
      { href: '/journal', label: 'Journal', icon: PenTool },
      { href: '/insights', label: 'Insights', icon: Lightbulb },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/academy', label: 'Academy', icon: GraduationCap },
      { href: '/library', label: 'Library', icon: BookOpen },
    ],
  },
  {
    label: '',
    items: [
      { href: '/store', label: 'Store', icon: ShoppingBag },
      { href: '/dream-community', label: 'Community', icon: MessageCircle },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const navItems = navGroups.flatMap((group) => group.items);

function LoadingShell() {
  return (
    <div className="min-h-screen bg-paper p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-32 animate-pulse rounded-2xl bg-midnight-950/5" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-midnight-950/5" />
          <div className="h-40 animate-pulse rounded-2xl bg-midnight-950/5" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-midnight-950/5" />
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
      <div className="min-h-screen bg-paper text-midnight-950">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="w-full border-b border-midnight-950/8 bg-white p-6 lg:w-64 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/dreamscourt-icon-color.png" alt="" width={416} height={362} className="h-8 w-auto" priority />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Dreamscourt</p>
                <p className="text-sm font-semibold text-midnight-950">Private workspace</p>
              </div>
            </div>

            <nav className="mt-8 space-y-5">
              {navGroups.map((group) => (
                <div key={group.label || 'ungrouped'}>
                  {group.label && (
                    <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-gray-400">{group.label}</p>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item === activeItem;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                            isActive ? 'bg-midnight-950 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-midnight-950'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-8 rounded-md border border-midnight-950/8 bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-midnight-950">A private sanctuary</p>
              <p className="mt-2 leading-6">Every layer lives inside Dreamscourt so you remain in one calm, immersive space.</p>
            </div>

            <button
              onClick={workspace.logout}
              className="mt-6 flex w-full items-center gap-2 rounded-md border border-midnight-950/15 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:border-midnight-950/30 hover:text-midnight-950"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </aside>

          <main className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
                  <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
                  Dreamscourt workspace
                </span>
                <h2 className="mt-2 text-xl font-semibold text-midnight-950">{activeItem?.label ?? 'Dreamscourt'}</h2>
              </div>
              <div className="rounded-md border border-midnight-950/10 bg-white px-4 py-2.5 text-sm text-gray-600">
                {workspace.user?.email || 'Signed in'}
              </div>
            </div>

            {workspace.error && (
              <div className="mb-6 flex items-start justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>{workspace.error}</p>
                <button onClick={() => workspace.setError(null)} aria-label="Dismiss" className="shrink-0 text-red-400 hover:text-red-600">
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
