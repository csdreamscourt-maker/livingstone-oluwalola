import { Hero, ComingSoon } from '@/components/sections';

export default function IdeasPage() {
  return (
    <>
      <Hero
        subtitle="Intellectual exploration"
        title="Ideas & concepts"
        description="Explore thought-provoking ideas, conceptual frameworks, and emerging perspectives that shape our understanding of leadership and innovation."
      />
      <ComingSoon
        description="We're curating a collection of original ideas and conceptual explorations that push the boundaries of strategic thinking and innovation."
        ctaLabel="Back to home"
        ctaHref="/"
      />
    </>
  );
}
