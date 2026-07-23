import { Container, Section } from '@/components/ui';
import { Hero } from '@/components/sections';
import { listIdeasArticles } from '@/lib/db';
import { ArticlesFilter } from './ArticlesFilter';

export const metadata = {
  title: 'Articles | Livingstone',
  description: 'Thoughtful perspectives on leadership, strategy, faith, innovation, and the frameworks that drive transformation.',
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await listIdeasArticles(true);

  return (
    <>
      <Hero
        subtitle="Insights & perspectives"
        title="Latest articles & writings"
        description="Thoughtful perspectives on leadership, strategy, faith, innovation, and the frameworks that drive transformation."
      />

      <Section padding="xl">
        <Container>
          <ArticlesFilter articles={articles} />
        </Container>
      </Section>
    </>
  );
}
