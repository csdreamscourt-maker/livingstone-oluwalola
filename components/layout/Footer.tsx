'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { BRAND, NAVIGATION, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight-950 text-white">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <h4 className="text-lg font-serif font-bold mb-4">{BRAND.name}</h4>
            <p className="text-sm text-stone-300 leading-relaxed">
              {BRAND.description}
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Navigation
            </h5>
            <ul className="space-y-2">
              {NAVIGATION.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-300 hover:text-gold-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Resources
            </h5>
            <ul className="space-y-2">
              {NAVIGATION.slice(5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-300 hover:text-gold-500 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              Connect
            </h5>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  className="text-sm text-stone-300 hover:text-gold-500 transition-colors"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-stone-400">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-gold-500 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gold-500 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
