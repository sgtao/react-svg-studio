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
 * Maps each palette onto Chakra's `colorPalette` semantic slots. In light mode,
 * `subtle` is deliberately the exact hex the user picked (the "100" step) — these
 * accents are pastel by design. In dark mode, `subtle`/`muted`/`emphasized`/`fg`
 * flip to dark-tinted steps (900/800/700/200) so panels built from these tokens
 * (e.g. Workbench cards, T-00-9) don't stay light-pastel on a dark page. `solid`
 * and `contrast` (text on a `solid` background) stay the same in both modes —
 * `solid` (500) is bright enough to read against either background, so `contrast`
 * can stay dark (950) rather than the usual light-on-solid default.
 */
function semanticScale(name: AccentName) {
  return {
    contrast: { value: `{colors.${name}.950}` },
    fg: { value: { _light: `{colors.${name}.700}`, _dark: `{colors.${name}.200}` } },
    subtle: { value: { _light: `{colors.${name}.100}`, _dark: `{colors.${name}.900}` } },
    muted: { value: { _light: `{colors.${name}.200}`, _dark: `{colors.${name}.800}` } },
    emphasized: { value: { _light: `{colors.${name}.300}`, _dark: `{colors.${name}.700}` } },
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
