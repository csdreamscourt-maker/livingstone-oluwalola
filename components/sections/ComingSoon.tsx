import { Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function ComingSoon({ description, ctaLabel, ctaHref }: ComingSoonProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container size="md">
        <div className="rounded-lg border border-midnight-950/10 p-8 text-center md:p-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Coming soon</span>
          <p className="mt-4 max-w-md mx-auto text-sm leading-6 text-gray-600">{description}</p>
          <a
            href={ctaHref}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-midnight-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-midnight-800"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </a>
        </div>
      </Container>
    </section>
  );
}
