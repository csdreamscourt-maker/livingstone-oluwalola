export const BRAND = {
  name: 'Livingstone Oluwalola',
  tagline: 'Faith. Leadership. Systems. Innovation.',
  description:
    'Building people, businesses, and institutions through faith-driven strategic thinking and intellectual frameworks.',
};

export const NAVIGATION = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Ideas Library',
    href: '/ideas',
    children: [
      { label: 'Ideas Library', href: '/ideas', description: 'Long-form perspectives on faith, leadership, and systems.' },
      { label: 'Articles', href: '/articles', description: 'Shorter dispatches and reflections.' },
      { label: 'Framework Vault', href: '/resources', description: 'Signature models, ready to apply.' },
    ],
  },
  {
    label: 'Ecosystem',
    href: '/companies',
    children: [
      { label: 'Companies', href: '/companies', description: 'The ventures and institutions in the LO brand tree.' },
      { label: 'Frameworks', href: '/frameworks', description: 'Strategic models for growth and transformation.' },
      { label: 'Dreamscourt', href: '/dashboard', description: 'A private spiritual reflection platform.' },
    ],
  },
  { label: 'Speaking', href: '/speaking' },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAVIGATION = {
  Explore: [
    { label: 'About', href: '/about' },
    { label: 'Frameworks', href: '/frameworks' },
    { label: 'Companies', href: '/companies' },
    { label: 'Speaking', href: '/speaking' },
  ],
  Library: [
    { label: 'Ideas Library', href: '/ideas' },
    { label: 'Articles', href: '/articles' },
    { label: 'Framework Vault', href: '/resources' },
    { label: 'Community', href: '/community' },
  ],
  Connect: [
    { label: 'Contact', href: '/contact' },
    { label: 'Dreamscourt', href: '/dashboard' },
  ],
};

export const SOCIAL_LINKS: { platform: string; href: string; icon: string }[] = [];
