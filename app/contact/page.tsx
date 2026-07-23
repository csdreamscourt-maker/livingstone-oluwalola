import { getPublicSiteSettings } from '@/lib/db';
import { ContactPageClient } from './ContactPageClient';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  return <ContactPageClient contactEmail={settings.contact_email} contactOffice={settings.contact_office} />;
}
