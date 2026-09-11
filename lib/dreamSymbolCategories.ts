/**
 * Canonical Dream Directory categories. Kept as a plain ordered list (not a DB table) since
 * this taxonomy is fixed and small — the admin form and the Library's directory view both
 * read from here so a symbol's category always lines up with a real section.
 */
export const DREAM_SYMBOL_CATEGORIES = [
  'Animals',
  'People',
  'Body Parts',
  'Numbers',
  'Colors',
  'Nature & Weather',
  'Buildings & Places',
  'Food & Provision',
  'Objects & Tools',
  'Movement & Actions',
  'Emotions & Sensations',
  'Clothing & Adornment',
] as const;

export type DreamSymbolCategory = (typeof DREAM_SYMBOL_CATEGORIES)[number];
