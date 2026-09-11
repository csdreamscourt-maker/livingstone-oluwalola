/**
 * The 9-category taxonomy from "The Dreamer's Sacred Space Journal" (Table 0, "Categories of
 * Prophetic Dreams") — descriptions paraphrase the journal's own definitions closely. This is
 * meant for classifying a whole dream so it can be found again later, not for decoding symbols.
 */
export const DREAM_TYPES = [
  {
    value: 'destiny_based',
    label: 'Destiny Based',
    description: "Speaks to your destiny, ministry, calling, assignment, or future in the light of God's will.",
  },
  {
    value: 'creative_educative',
    label: 'Creative / Educative',
    description: 'Teaches you something you did not know, or reveals what you were not aware of.',
  },
  {
    value: 'instructive',
    label: 'Instructive',
    description: "Brings specific instruction meant to be obeyed, directing your journey in God's will.",
  },
  {
    value: 'warning',
    label: 'Warning',
    description: "Warns you concerning a potential pitfall or the enemy's trap, to preserve you from it.",
  },
  {
    value: 'impartation',
    label: 'Impartation',
    description: 'Brings a tangible transfer of a gift, grace, skill, or ability.',
  },
  {
    value: 'symbolic',
    label: 'Symbolic',
    description: 'Heavily laden with symbols that need prophetic interpretation — not literal or plainly understood.',
  },
  {
    value: 'warfare',
    label: 'Warfare',
    description: "Reveals an area of spiritual attack or the enemy's plans and strategies.",
  },
  {
    value: 'extrinsic',
    label: 'Extrinsic',
    description: 'Shows you something about others — family, church, city, or nation — rather than yourself.',
  },
  {
    value: 'uncertain',
    label: 'Uncertain',
    description: 'You cannot yet classify which category this dream belongs to — a legitimate placeholder.',
  },
] as const;

export type DreamType = (typeof DREAM_TYPES)[number]['value'];

export function dreamTypeLabel(value?: string | null): string | undefined {
  return DREAM_TYPES.find((t) => t.value === value)?.label;
}
