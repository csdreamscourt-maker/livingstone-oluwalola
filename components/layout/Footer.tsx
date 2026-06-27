'use client';

import Link from 'next/link';
import { Container } from '@/components/ui';
import { Mail, Send, MessageCircle } from 'lucide-react';

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
    <footer className="bg-midnight-950 border-t border-gray-800">
      <Container>
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <Link href="/" className="inline-flex items-start gap-2 group mb-8">
                <div className="text-2xl font-serif font-bold text-gold-600 group-hover:text-gold-500 transition-colors">
                  ✦
                </div>
                <div>
                  <div className="text-lg font-serif font-bold text-white group-hover:text-gold-600 transition-colors">
                    Livingstone
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Faith • Leadership • Systems
                  </div>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building systems and frameworks for lasting impact across faith, leadership, technology, and human development.
              </p>
            </div>

            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-white font-serif font-bold mb-6 text-sm uppercase tracking-wide">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-gold-600 transition-colors text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-gray-500 text-sm">
                © {currentYear} Livingstone. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="mailto:contact@livingstone.com"
                  className="text-gray-400 hover:text-gold-600 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-600 transition-colors"
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-600 transition-colors"
                  aria-label="Contact"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
