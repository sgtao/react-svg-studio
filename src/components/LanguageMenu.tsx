import { Box, Button, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LOCALES, useI18n } from '../i18n'

interface LanguageMenuProps {
  segments: string[]
}

/** Same open/close pattern as `AppearanceMenu`; the actual switch stays a `<Link>` navigation (absolute rule 6). */
export default function LanguageMenu({ segments }: LanguageMenuProps) {
  const { t, locale } = useI18n()
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
        aria-label={t('nav.language.ariaLabel')}
        onClick={() => setOpen((value) => !value)}
      >
        🌐 {t(`common.localeNames.${locale}`)}
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
          padding="2"
          boxShadow="lg"
          minW="32"
        >
          <Box as="nav" aria-label={t('nav.language.ariaLabel')} display="flex" flexDirection="column" gap="1">
            {LOCALES.map((target) => {
              const path = [...segments]
              path[1] = target
              return (
                <Button
                  key={target}
                  asChild
                  type="button"
                  size="sm"
                  variant={target === locale ? 'solid' : 'ghost'}
                  justifyContent="flex-start"
                  onClick={() => setOpen(false)}
                >
                  <Link to={path.join('/') || '/'} aria-current={target === locale ? 'true' : undefined}>
                    <Text as="span">{t(`common.localeNames.${target}`)}</Text>
                  </Link>
                </Button>
              )
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
