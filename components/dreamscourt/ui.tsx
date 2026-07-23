import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">
      <span className="h-[5px] w-[5px] rounded-full bg-gold-600" />
      {children}
    </span>
  );
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-midnight-950/10 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-midnight-950/10 bg-gray-50 p-2.5 text-gold-700">
      {children}
    </div>
  );
}
