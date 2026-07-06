import { Hero, ComingSoon } from '@/components/sections';

export default function ResourcesPage() {
  return (
    <>
      <Hero
        subtitle="Learning materials"
        title="Resources & tools"
        description="Access curated resources, tools, templates, and learning materials to support your leadership journey and organizational transformation."
      />
      <ComingSoon
        description="We're preparing a comprehensive collection of resources, templates, guides, and tools to support your transformation journey."
        ctaLabel="Access dashboard"
        ctaHref="/dashboard"
      />
    </>
  );
}
