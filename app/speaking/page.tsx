import { Hero, ComingSoon } from '@/components/sections';

export default function SpeakingPage() {
  return (
    <>
      <Hero
        subtitle="Leadership communications"
        title="Speaking & events"
        description="Explore keynote presentations, seminars, and speaking engagements designed to inspire and transform organizational thinking."
      />
      <ComingSoon
        description="Learn more about speaking engagements, keynote presentations, and leadership seminars."
        ctaLabel="Inquire about speaking"
        ctaHref="/contact"
      />
    </>
  );
}
