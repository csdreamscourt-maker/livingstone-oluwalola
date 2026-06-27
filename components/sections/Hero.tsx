import { Container, Button } from '@/components/ui';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  cta2?: {
    label: string;
    href: string;
  };
}

export function Hero({ title, subtitle, description, cta, cta2 }: HeroProps) {
  return (
    <section className="relative py-24 sm:py-32 md:py-40 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 opacity-5 rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-midnight-950 opacity-5 rounded-full -ml-48 -mb-48" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <p className="text-sm sm:text-base font-medium text-gold-600 mb-4 uppercase tracking-wider">
              {subtitle}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {(cta || cta2) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {cta && (
                <Button href={cta.href} size="lg">
                  {cta.label}
                </Button>
              )}
              {cta2 && (
                <Button href={cta2.href} variant="tertiary" size="lg">
                  {cta2.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
