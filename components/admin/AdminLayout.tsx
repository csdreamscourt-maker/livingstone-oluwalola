'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminSession } from '@/lib/admin/useAdminSession';
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Inbox,
  LogOut,
  Mail,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/store-products', label: 'Store products', icon: ShoppingBag },
  { href: '/admin/dream-symbols', label: 'Dream symbols', icon: Sparkles },
  { href: '/admin/dream-articles', label: 'Dream articles', icon: BookOpen },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
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
            <span className="relative flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-[1.4px] border-gold-400/70">
              <span className="h-[6px] w-[6px] rounded-[1px] bg-gold-300" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">Livingstone</p>
              <p className="text-sm font-semibold text-white">Super admin</p>
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

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-2 rounded-md border border-white/10 px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors duration-200 hover:border-white/25 hover:text-white"
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
                Admin
              </span>
              <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/60">
              {user?.email || 'Signed in'}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
