export type SettingField = { key: string; label: string; default: string };
export type SettingGroup = { label: string; fields: SettingField[] };

export const SETTINGS_GROUPS: SettingGroup[] = [
  {
    label: 'Dreamscourt',
    fields: [{ key: 'whatsapp_community_link', label: 'WhatsApp community link', default: '' }],
  },
  {
    label: 'Homepage',
    fields: [
      {
        key: 'homepage_hero_title',
        label: 'Hero title',
        default: 'The digital headquarters for bold thinking and calm execution.',
      },
      {
        key: 'homepage_hero_description',
        label: 'Hero description',
        default:
          'Explore strategic frameworks, elegant digital experiences, and living institutions — built at the intersection of faith, leadership, and technology.',
      },
    ],
  },
  {
    label: 'Contact',
    fields: [
      { key: 'contact_email', label: 'Contact email', default: 'contact@livingstone.com' },
      { key: 'contact_office', label: 'Office / location', default: 'Global Operations' },
    ],
  },
  {
    label: 'Social',
    fields: [
      { key: 'social_twitter', label: 'Twitter / X URL', default: '' },
      { key: 'social_linkedin', label: 'LinkedIn URL', default: '' },
      { key: 'social_youtube', label: 'YouTube URL', default: '' },
    ],
  },
];

export const SETTINGS_DEFAULTS: Record<string, string> = Object.fromEntries(
  SETTINGS_GROUPS.flatMap((group) => group.fields.map((field) => [field.key, field.default]))
);
