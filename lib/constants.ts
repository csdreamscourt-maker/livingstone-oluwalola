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

export type CompanyCategory = 'Companies & Startups' | 'Social Impact' | 'Faith-Based';

export const COMPANIES: {
  id: string;
  name: string;
  description: string;
  category: CompanyCategory;
  href: string;
}[] = [
  {
    id: 'dreamscourt',
    name: 'Dreamscourt',
    description: 'A private spiritual intelligence platform for dream capture, prayer journaling, and reflective pattern recognition.',
    category: 'Companies & Startups',
    href: '/companies/dreamscourt',
  },
  {
    id: 'house-of-uphaz',
    name: 'House of Uphaz',
    description: 'Institutional development and leadership training for organizations building lasting capacity.',
    category: 'Companies & Startups',
    href: '/companies/house-of-uphaz',
  },
  {
    id: 'adjunct-corporation',
    name: 'Adjunct Corporation',
    description: 'Strategic advisory and business systems design for founders and executive teams.',
    category: 'Companies & Startups',
    href: '/companies/adjunct-corporation',
  },
  {
    id: 'eternity-windows',
    name: 'Eternity Windows Publication',
    description: 'A publishing house for thought leadership at the intersection of theology, strategy, and culture.',
    category: 'Companies & Startups',
    href: '/companies/eternity-windows',
  },
  {
    id: 'agenda58',
    name: 'Agenda58 Foundation',
    description: 'Social impact initiatives focused on community transformation and nation building.',
    category: 'Social Impact',
    href: '/companies/agenda58',
  },
  {
    id: 'young-ministers',
    name: 'Young Ministers Training School',
    description: 'Formation and leadership development for a rising generation of faith-centered ministers.',
    category: 'Faith-Based',
    href: '/companies/young-ministers',
  },
];

export type FrameworkCategory = 'Leadership' | 'Strategy' | 'Faith' | 'Growth';

export const FRAMEWORKS: {
  id: string;
  title: string;
  description: string;
  category: FrameworkCategory;
}[] = [
  {
    id: 'mind-engineering',
    title: 'Mind Engineering',
    description: 'A model for deliberately shaping thought patterns, convictions, and mental infrastructure for high-level execution.',
    category: 'Growth',
  },
  {
    id: 'outlier-potential',
    title: 'Outlier Potential',
    description: 'A framework for identifying and breaking free from conventional thinking to access uncommon results.',
    category: 'Strategy',
  },
  {
    id: 'redemptive-sagacity',
    title: 'Redemptive Sagacity',
    description: 'Grounding strategic wisdom in eternal principles — sourcing models for growth from biblical truth.',
    category: 'Faith',
  },
  {
    id: 'building-convictions',
    title: 'Building Convictions',
    description: 'A discipline for forming the character and clarity of purpose that outlast circumstance.',
    category: 'Leadership',
  },
  {
    id: 'nation-building',
    title: 'Nation Building',
    description: 'Institutional design principles for leaders working at the scale of communities and nations.',
    category: 'Strategy',
  },
  {
    id: 'systems-thinking',
    title: 'Faith-Driven Systems Thinking',
    description: 'Integrating spiritual principles with strategic planning to design for purposeful endurance.',
    category: 'Faith',
  },
];

export const ARTICLES: {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  body: string[];
}[] = [
  {
    id: 'outlier-edge',
    title: 'The Outlier Edge: Why the Conventional Path Rarely Leads to Uncommon Results',
    excerpt: 'Those who change the world don’t think like the masses. On breaking free from the less profitable conventional flow of life.',
    date: '2026-06-02',
    category: 'Strategy',
    readTime: '6 min read',
    body: [
      'Most institutions are optimized for the average outcome. They reward conformity, standardize risk, and quietly discourage the very thinking that produces breakthroughs. If your ambition is an uncommon result, an average process will not get you there.',
      'Outlierness is not contrarianism for its own sake. It is the discipline of testing every inherited assumption against first principles before accepting it as true. Some conventions survive that test. Most do not.',
      'The leaders and builders I work with are rarely reckless. They are simply unwilling to let convenience substitute for conviction. That distinction — between comfort and clarity — is where outlier potential actually lives.',
    ],
  },
  {
    id: 'building-what-lasts',
    title: 'Building First, What Lasts',
    excerpt: 'A case for purposeful endurance over short-term wins, and why the strongest institutions are built for the long run.',
    date: '2026-05-14',
    category: 'Institutional Development',
    readTime: '7 min read',
    body: [
      'Every institution eventually faces the same test: does it depend on the person who built it, or can it outlive them? Most do not survive that transition, because they were never designed to.',
      'Building for posterity means making unglamorous choices early — documenting judgment instead of just exercising it, distributing conviction instead of concentrating it, and measuring success in decades rather than quarters.',
      'This is slower than chasing the next win. It is also the only strategy that compounds.',
    ],
  },
  {
    id: 'faith-and-strategy',
    title: 'Faith and Strategy Are Not Opposites',
    excerpt: 'Every durable framework for growth is sourced from principle, not preference. On grounding strategic thinking in eternal truth.',
    date: '2026-04-22',
    category: 'Faith',
    readTime: '5 min read',
    body: [
      'It is tempting to treat faith as a private matter and strategy as a technical one — as if the two occupy separate rooms in the same building. In practice, the strongest strategic thinking I have encountered is never value-neutral. It is anchored to something.',
      'For the LO brand, that anchor is a redemptive thought process grounded in honour for God and love for humanity. Every model and framework for growth is sourced from principles that guarantee building for posterity, not just for the current cycle.',
      'This is not a constraint on ambition. It is what makes ambition sustainable.',
    ],
  },
];
