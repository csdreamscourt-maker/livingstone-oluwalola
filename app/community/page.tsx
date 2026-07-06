import { Hero, ComingSoon } from '@/components/sections';

export default function CommunityPage() {
  return (
    <>
      <Hero
        subtitle="Collective growth"
        title="Community"
        description="Join a global community of leaders, innovators, and thought leaders committed to transformation, excellence, and lasting impact."
      />
      <ComingSoon
        description="We're building an exclusive community of leaders and innovators. Be among the first to join when we launch."
        ctaLabel="Express interest"
        ctaHref="/contact"
      />
    </>
  );
}
