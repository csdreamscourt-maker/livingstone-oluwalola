'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui';
import { FOOTER_NAVIGATION } from '@/lib/constants';
import { Mail } from 'lucide-react';

type PublicSettings = {
  contact_email?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_youtube?: string;
};

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H15.86l-5.214-6.817L4.68 21.75H1.37l7.73-8.835L.808 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.558V9h3.556z" />
    </svg>
  );
}

function YouTubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const links = FOOTER_NAVIGATION;
  const [settings, setSettings] = useState<PublicSettings>({});

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    })();
  }, []);

  const contactEmail = settings.contact_email || 'contact@livingstone.com';
  const socialLinks = [
    { href: settings.social_twitter, label: 'Twitter / X', icon: XIcon },
    { href: settings.social_linkedin, label: 'LinkedIn', icon: LinkedInIcon },
    { href: settings.social_youtube, label: 'YouTube', icon: YouTubeIcon },
  ].filter((link) => link.href);

  return (
    <footer className="border-t border-midnight-950/8 bg-paper">
      <Container>
        <div className="py-14 md:py-20">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex items-center mb-4">
                <Image src="/brand/livingstone-logo-full.png" alt="Livingstone Oluwalola" width={1267} height={423} className="h-10 w-auto" />
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
              <div className="flex items-center gap-5">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-gray-500 hover:text-midnight-950 transition-colors duration-200"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
                <a
                  href={`mailto:${contactEmail}`}
                  aria-label="Email"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-midnight-950 transition-colors duration-200"
                >
                  <Mail size={14} />
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
