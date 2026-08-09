import { Box, Button, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { ACCENT_NAMES, ACCENT_SCALES } from '../theme/colors'
import { useAccent } from '../theme/AccentProvider'
import { useColorMode } from './ui/color-mode'

const MODE_EMOJI: Record<'light' | 'dark', string> = { light: '☀️', dark: '🌙' }
const MODES = ['light', 'dark'] as const

/** Combines the accent-color picker and the light/dark toggle in one dropdown (design §2). */
export default function AppearanceMenu() {
  const { t } = useI18n()
  const { accent, setAccent } = useAccent()
  const { colorMode, setColorMode } = useColorMode()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <Box ref={containerRef} position="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        borderRadius="full"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Box
          as="span"
          display="inline-block"
          boxSize="3"
          borderRadius="full"
          bg={ACCENT_SCALES[accent]['500']}
          marginInlineEnd="2"
        />
        {t('appearance.trigger')}
      </Button>
      {open ? (
        <Box
          position="absolute"
          insetInlineEnd="0"
          top="calc(100% + 4px)"
          zIndex="1"
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          padding="3"
          boxShadow="lg"
          minW="44"
        >
          <Text fontSize="xs" color="fg.muted" marginBottom="2">
            {t('appearance.colorLabel')}
          </Text>
          <Box display="flex" gap="2" marginBottom="3">
            {ACCENT_NAMES.map((name) => (
              <Box
                key={name}
                as="button"
                aria-pressed={accent === name}
                aria-label={t(`appearance.accentNames.${name}`)}
                onClick={() => setAccent(name)}
                boxSize="6"
                borderRadius="full"
                bg={ACCENT_SCALES[name]['500']}
                borderWidth={accent === name ? '2px' : '1px'}
                borderColor={accent === name ? 'fg' : 'border'}
                cursor="pointer"
              />
            ))}
          </Box>
          <Text fontSize="xs" color="fg.muted" marginBottom="2">
            {t('appearance.modeLabel')}
          </Text>
          <Box display="flex" gap="2">
            {MODES.map((mode) => (
              <Button
                key={mode}
                type="button"
                size="xs"
                variant={colorMode === mode ? 'solid' : 'outline'}
                onClick={() => setColorMode(mode)}
              >
                {MODE_EMOJI[mode]} {t(`appearance.${mode}`)}
              </Button>
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
