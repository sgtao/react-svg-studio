import { Box } from '@chakra-ui/react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ACCENT_NAMES, type AccentName } from './colors'

const STORAGE_KEY = 'svg-studio-accent'
const DEFAULT_ACCENT: AccentName = 'lime'

function isAccentName(value: string | null): value is AccentName {
  return value !== null && (ACCENT_NAMES as readonly string[]).includes(value)
}

function readStoredAccent(): AccentName {
  if (typeof window === 'undefined') return DEFAULT_ACCENT
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isAccentName(stored) ? stored : DEFAULT_ACCENT
}

export interface AccentContextValue {
  accent: AccentName
  setAccent: (accent: AccentName) => void
}

const AccentContext = createContext<AccentContextValue | null>(null)

/**
 * The accent preset (Lime/Mint/Sky) is independent of light/dark mode, with its
 * own localStorage key. It's applied via Chakra's `colorPalette`, which cascades
 * as a CSS custom property to every descendant that reads a colorPalette-aware
 * token — no per-component wiring needed beyond this one wrapper.
 */
export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AccentName>(readStoredAccent)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, accent)
  }, [accent])

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      <Box colorPalette={accent}>{children}</Box>
    </AccentContext.Provider>
  )
}

export function useAccent(): AccentContextValue {
  const context = useContext(AccentContext)
  if (!context) {
    throw new Error('useAccent must be used within an AccentProvider')
  }
  return context
}
