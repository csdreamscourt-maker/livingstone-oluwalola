'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminSession } from '@/lib/admin/useAdminSession';
import {
  BarChart3,
  BookOpen,
  Building2,
  GraduationCap,
  Inbox,
  KeyRound,
  Lightbulb,
  LogOut,
  Mail,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/frameworks', label: 'Frameworks', icon: Workflow },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/ideas-articles', label: 'Ideas & articles', icon: Lightbulb },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/store-products', label: 'Store products', icon: ShoppingBag },
  { href: '/admin/dream-symbols', label: 'Dream symbols', icon: Sparkles },
  { href: '/admin/dream-articles', label: 'Dream articles', icon: BookOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/integrations', label: 'Integrations & keys', icon: KeyRound },
];

function LoadingShell() {
  return (
    <div className="min-h-screen bg-paper p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-32 animate-pulse rounded-2xl bg-midnight-950/5" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-midnight-950/5" />
          <div className="h-40 animate-pulse rounded-2xl bg-midnight-950/5" />
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { user, loading, logout } = useAdminSession();
  const pathname = usePathname();

  if (loading) {
    return <LoadingShell />;
  }

  const activeItem = navItems
    .slice()
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));

  return (
    <div className="min-h-screen bg-paper text-midnight-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-midnight-950/8 bg-white p-6 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-[1.4px] border-midnight-950">
              <span className="h-[6px] w-[6px] rounded-[1px] bg-gold-600" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Livingstone</p>
              <p className="text-sm font-semibold text-midnight-950">Super admin</p>
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
                    isActive ? 'bg-midnight-950 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-midnight-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-2 rounded-md border border-midnight-950/15 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:border-midnight-950/30 hover:text-midnight-950"
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
                Admin
              </span>
              <h2 className="mt-2 text-xl font-semibold text-midnight-950">{title}</h2>
            </div>
            <div className="rounded-md border border-midnight-950/10 bg-white px-4 py-2.5 text-sm text-gray-600">
              {user?.email || 'Signed in'}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
