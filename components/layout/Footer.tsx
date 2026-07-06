'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Product: [
      { label: 'Frameworks', href: '/frameworks' },
      { label: 'Articles', href: '/articles' },
      { label: 'Companies', href: '/companies' },
      { label: 'About', href: '/about' },
    ],
    Resources: [
      { label: 'Ideas', href: '/ideas' },
      { label: 'Speaking', href: '/speaking' },
      { label: 'Resources', href: '/resources' },
      { label: 'Community', href: '/community' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact', href: '/contact' },
    ],
  };

  return (
    <footer className="border-t border-midnight-950/8 bg-paper">
      <Container>
        <div className="py-14 md:py-20">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <span className="relative flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border-[1.4px] border-midnight-950">
                  <span className="h-[6px] w-[6px] rounded-[1px] bg-gold-600" />
                </span>
                <span className="text-sm font-semibold tracking-[-0.01em] text-midnight-950">Livingstone</span>
              </Link>
              <p className="text-gray-500 text-sm leading-6 max-w-xs">
                Building systems and frameworks for lasting impact across faith, leadership, technology, and human development.
              </p>
            </div>

            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-midnight-950 font-semibold mb-4 text-[11px] uppercase tracking-[0.12em]">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-gray-500 hover:text-midnight-950 transition-colors duration-200 text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-midnight-950/8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {currentYear} Livingstone. All rights reserved.
              </p>
              <a
                href="mailto:contact@livingstone.com"
                aria-label="Email"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-midnight-950 transition-colors duration-200"
              >
                <Mail size={14} />
                contact@livingstone.com
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
