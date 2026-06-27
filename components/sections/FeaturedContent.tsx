'use client';

import { Container, Card, Badge } from '@/components/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  description?: string;
  items: Item[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function FeaturedContent({
  title,
  subtitle,
  description,
  items,
  viewAllHref,
  viewAllLabel = 'View All',
}: FeaturedContentProps) {
  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-100 opacity-30 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          {subtitle && (
            <p className="text-sm md:text-base font-bold text-gold-600 mb-4 uppercase tracking-widest">
              {subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-midnight-950 mb-6 leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="group"
              style={{
                animation: `slideUp 600ms ease-out ${index * 100}ms both`,
              }}
            >
              <Card variant="bordered" padding="lg" className="h-full flex flex-col cursor-pointer">
                <div className="flex-1">
                  {item.category && (
                    <Badge variant="gold" className="mb-4 inline-block">
                      {item.category}
                    </Badge>
                  )}
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-midnight-950 mb-3 group-hover:text-gold-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {item.metadata && (
                  <p className="text-xs text-gray-500 py-4 border-t border-gray-200 mb-4">
                    {item.metadata}
                  </p>
                )}

                {item.href && (
                  <div className="flex items-center gap-2 text-gold-600 font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Learn More</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {viewAllHref && (
          <div className="text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-lg font-semibold text-midnight-950 hover:text-gold-600 group transition-colors duration-300"
            >
              {viewAllLabel}
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </Container>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
