import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { buildLocalePath, resolveLocale, type Locale } from './core'
import { t } from './dictionary'

export interface I18n {
  locale: Locale
  t: (key: string, vars?: Record<string, string | number>) => string
  localePath: (path: string) => string
}

/**
 * Reads the current locale from the router's current pathname. Computed fresh on every
 * render (not cached in state): react-router re-renders the mounted route tree on every
 * navigation, including `<Link>` clicks, which do not fire `popstate`.
 */
export function useI18n(): I18n {
  const locale = resolveLocale(useLocation().pathname)

  return useMemo(
    () => ({
      locale,
      t: (key: string, vars?: Record<string, string | number>) => t(locale, key, vars),
      localePath: (path: string) => buildLocalePath(locale, path),
    }),
    [locale],
  )
}
