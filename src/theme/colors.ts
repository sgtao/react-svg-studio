export type ColorStep = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'

export type ColorScale = Record<ColorStep, string>

export const ACCENT_NAMES = ['lime', 'mint', 'sky'] as const

export type AccentName = (typeof ACCENT_NAMES)[number]

/**
 * Fixed per-category badge colors, independent of the user-selectable `AccentName`
 * preset above. Uses Chakra's built-in palette names directly (no custom scale
 * needed — `createSystem(defaultConfig, ...)` already ships colorPalette-aware
 * semantic tokens for these) — see 01_docs/07-t-00-10-list-detail-pages-design.md §3.
 */
export const CATEGORY_BADGE_PALETTE = ['pink', 'orange', 'purple', 'teal', 'cyan', 'blue'] as const

/** Cycles through CATEGORY_BADGE_PALETTE by a category's declared `order`, so new categories get a color automatically. */
export function categoryBadgeColor(order: number): (typeof CATEGORY_BADGE_PALETTE)[number] {
  return CATEGORY_BADGE_PALETTE[order % CATEGORY_BADGE_PALETTE.length]
}

/**
 * 50-950 scales for the three accent presets, generated from the exact hexes
 * the user picked (kept verbatim at the "100" step) with a fixed moderate
 * saturation curve for the other steps — see 01_docs/04-chakra-ui-theming-design.md §5.
 */
export const ACCENT_SCALES: Record<AccentName, ColorScale> = {
  lime: {
    '50': '#fafbf4',
    '100': '#f7ffcc',
    '200': '#e7f0b2',
    '300': '#d7e58a',
    '400': '#c6d864',
    '500': '#b2c936',
    '600': '#97ab2b',
    '700': '#7c8d20',
    '800': '#606e17',
    '900': '#434d0f',
    '950': '#2a3008',
  },
  mint: {
    '50': '#f4fbf4',
    '100': '#ccffcc',
    '200': '#b2f0b2',
    '300': '#8ae58a',
    '400': '#64d864',
    '500': '#36c936',
    '600': '#2bab2b',
    '700': '#208d20',
    '800': '#176e17',
    '900': '#0f4d0f',
    '950': '#083008',
  },
  sky: {
    '50': '#f4f7fb',
    '100': '#cce6ff',
    '200': '#b2d2f0',
    '300': '#8ab8e5',
    '400': '#649fd8',
    '500': '#3681c9',
    '600': '#2b6cab',
    '700': '#20588d',
    '800': '#17436e',
    '900': '#0f2f4d',
    '950': '#081c30',
  },
}
