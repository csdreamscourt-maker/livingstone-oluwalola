import { Container, Card, Badge } from '@/components/ui';
import Link from 'next/link';

interface Item {
  id: string;
  title: string;
  description: string;
  category?: string;
  href?: string;
  metadata?: string;
}

interface FeaturedContentProps {
  title: string;
  subtitle?: string;
  items: Item[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function FeaturedContent({
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel = 'View All',
}: FeaturedContentProps) {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <Container>
        <div className="mb-12">
          {subtitle && (
            <p className="text-sm font-medium text-gold-600 mb-2 uppercase tracking-wider">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-midnight-950 mb-4">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <Card key={item.id} variant="bordered" hover className="flex flex-col">
              <div className="flex-1">
                {item.category && (
                  <Badge variant="primary" className="mb-3">
                    {item.category}
                  </Badge>
                )}
                <h3 className="text-xl font-serif font-bold text-midnight-950 mb-3">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              {item.metadata && (
                <p className="text-xs text-stone-500 mt-4 pt-4 border-t border-stone-200">
                  {item.metadata}
                </p>
              )}
              {item.href && (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gold-600 hover:text-gold-700 mt-4 inline-block"
                >
                  Read More →
                </Link>
              )}
            </Card>
          ))}
        </div>

        {viewAllHref && (
          <div className="text-center">
            <Link
              href={viewAllHref}
              className="text-base font-medium text-midnight-950 hover:text-gold-600 transition-colors"
            >
              {viewAllLabel} →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
