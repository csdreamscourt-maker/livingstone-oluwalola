import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
      <span className="h-[5px] w-[5px] rounded-full bg-gold-400" />
      {children}
    </span>
  );
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-2.5 text-gold-300">
      {children}
    </div>
  );
}
