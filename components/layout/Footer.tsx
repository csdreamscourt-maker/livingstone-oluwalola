'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { Mail, Send, MessageCircle, Sparkles, ArrowUpRight } from 'lucide-react';

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
      { label: 'Newsletter', href: '#' },
    ],
  };

  return (
    <footer className="relative overflow-hidden bg-indigo-600">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold-600" />

      <Container className="relative">
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3 group mb-6">
                <div className="relative w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-gold-600">
                  <Sparkles size={20} className="text-gold-400" />
                </div>
              </Link>
              <p className="text-indigo-100/60 text-sm leading-relaxed max-w-xs">
                Building systems and frameworks for lasting impact across faith, leadership, technology, and human development.
              </p>
            </div>

            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-white font-serif font-bold mb-5 text-sm uppercase tracking-[0.15em]">
                  <span className="text-white">{category}</span>
                </h4>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-1 text-indigo-100/70 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {item.label}
                        <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-indigo-100/50 text-sm">
                © {currentYear} Livingstone. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Mail, href: 'mailto:contact@livingstone.com', label: 'Email' },
                  { icon: Send, href: '#', label: 'Send' },
                  { icon: MessageCircle, href: '#', label: 'Contact' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="group inline-flex items-center justify-center w-10 h-10 rounded-xl glass-dark border border-gold-600 text-gold-400 hover:text-gold-300 hover:border-gold-400 hover:scale-110 transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
