import { listFrameworks, listCompanies, listIdeasArticles, getPublicSiteSettings } from '@/lib/db';
import { HomeClient } from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [frameworks, companies, articles, settings] = await Promise.all([
    listFrameworks(true),
    listCompanies(true),
    listIdeasArticles(true),
    getPublicSiteSettings(),
  ]);

  return (
    <HomeClient
      frameworks={frameworks}
      companies={companies}
      articles={articles}
      heroTitle={settings.homepage_hero_title}
      heroDescription={settings.homepage_hero_description}
    />
  );
}
