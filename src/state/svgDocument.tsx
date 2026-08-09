import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { inspect, sanitize, type SvgInspection } from '../lib/svg'

export interface SvgDocumentState {
  source: string
  setSource: (source: string) => void
  name: string
  setName: (name: string) => void
  inspection: SvgInspection
  safeSource: string
}

const SvgDocumentContext = createContext<SvgDocumentState | null>(null)

export interface SvgDocumentProviderProps {
  initialSource: string
  initialName: string
  children: ReactNode
}

/**
 * Owns the document's source of truth. `inspection`/`safeSource` are derived via
 * `useMemo` (never `setState`) so they can never lag behind `source`.
 */
export function SvgDocumentProvider({
  initialSource,
  initialName,
  children,
}: SvgDocumentProviderProps) {
  const [source, setSource] = useState(initialSource)
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setSource(initialSource)
    setName(initialName)
  }, [initialSource, initialName])

  const inspection = useMemo(() => inspect(source), [source])
  const safeSource = useMemo(() => sanitize(source), [source])

  const value = useMemo<SvgDocumentState>(
    () => ({ source, setSource, name, setName, inspection, safeSource }),
    [source, name, inspection, safeSource],
  )

  return <SvgDocumentContext.Provider value={value}>{children}</SvgDocumentContext.Provider>
}

/** Reads the current {@link SvgDocumentState}. Must be called within a {@link SvgDocumentProvider}. */
export function useSvgDocument(): SvgDocumentState {
  const context = useContext(SvgDocumentContext)
  if (!context) {
    throw new Error('useSvgDocument must be used within a SvgDocumentProvider')
  }
  return context
}
