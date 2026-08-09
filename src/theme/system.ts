import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { ACCENT_SCALES, type AccentName } from './colors'

function tokenScale(name: AccentName) {
  const scale = ACCENT_SCALES[name]
  return {
    50: { value: scale['50'] },
    100: { value: scale['100'] },
    200: { value: scale['200'] },
    300: { value: scale['300'] },
    400: { value: scale['400'] },
    500: { value: scale['500'] },
    600: { value: scale['600'] },
    700: { value: scale['700'] },
    800: { value: scale['800'] },
    900: { value: scale['900'] },
    950: { value: scale['950'] },
  }
}

/**
 * Maps each palette onto Chakra's `colorPalette` semantic slots. `subtle` is
 * deliberately the exact hex the user picked (the "100" step) — these accents
 * are pastel by design, so `contrast` (text on a `solid` background) stays
 * dark (950) for all three rather than the usual light-on-solid default.
 */
function semanticScale(name: AccentName) {
  return {
    contrast: { value: `{colors.${name}.950}` },
    fg: { value: `{colors.${name}.700}` },
    subtle: { value: `{colors.${name}.100}` },
    muted: { value: `{colors.${name}.200}` },
    emphasized: { value: `{colors.${name}.300}` },
    solid: { value: `{colors.${name}.500}` },
    focusRing: { value: `{colors.${name}.500}` },
  }
}

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        lime: tokenScale('lime'),
        mint: tokenScale('mint'),
        sky: tokenScale('sky'),
      },
    },
    semanticTokens: {
      colors: {
        lime: semanticScale('lime'),
        mint: semanticScale('mint'),
        sky: semanticScale('sky'),
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
