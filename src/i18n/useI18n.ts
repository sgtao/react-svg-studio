import { useEffect, useMemo, useState } from 'react'
import { buildLocalePath, resolveLocale, DEFAULT_LOCALE, type Locale } from './core'
import { t } from './dictionary'

export interface I18n {
  locale: Locale
  t: (key: string, vars?: Record<string, string | number>) => string
  localePath: (path: string) => string
}

/**
 * Reads the current locale from `window.location.pathname` (no router dependency yet;
 * T-00-6 wires this to route params). Re-resolves on `popstate` (back/forward navigation).
 */
export function useI18n(): I18n {
  const [locale, setLocale] = useState<Locale>(() =>
    typeof window === 'undefined' ? DEFAULT_LOCALE : resolveLocale(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () => setLocale(resolveLocale(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return useMemo(
    () => ({
      locale,
      t: (key: string, vars?: Record<string, string | number>) => t(locale, key, vars),
      localePath: (path: string) => buildLocalePath(locale, path),
    }),
    [locale],
  )
}
