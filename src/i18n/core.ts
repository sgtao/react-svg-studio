export type Locale = 'en' | 'ja' | 'zh' | 'es'

export const LOCALES: readonly Locale[] = ['en', 'ja', 'zh', 'es']
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** Reads the locale from the first path segment, falling back to {@link DEFAULT_LOCALE}. */
export function resolveLocale(pathname: string): Locale {
  const [, first] = pathname.split('/')
  return isLocale(first) ? first : DEFAULT_LOCALE
}

/** Prefixes `path` with `/${locale}`, adding a leading slash to `path` if missing. */
export function buildLocalePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${normalized}`
}

export interface Dictionary {
  [key: string]: string | Dictionary
}

function lookup(dict: Dictionary, key: string): string | undefined {
  const value = key.split('.').reduce<Dictionary | string | undefined>((node, part) => {
    if (node && typeof node === 'object' && part in node) {
      return node[part]
    }
    return undefined
  }, dict)
  return typeof value === 'string' ? value : undefined
}

/**
 * Resolves `key` from `dictionaries[locale]`, falling back to
 * `dictionaries[DEFAULT_LOCALE]` and then to the raw key string.
 * `{name}` placeholders in the result are replaced from `vars`.
 */
export function translate(
  dictionaries: Partial<Record<Locale, Dictionary>>,
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const localeDict = dictionaries[locale]
  const fallbackDict = dictionaries[DEFAULT_LOCALE]
  const raw = (localeDict && lookup(localeDict, key)) ?? (fallbackDict && lookup(fallbackDict, key)) ?? key

  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}

/** Resolves a manifest's multi-lingual field for `locale`, falling back to English then any value. */
export function localized(record: Partial<Record<Locale, string>>, locale: Locale): string {
  const fallback = Object.values(record).find((value): value is string => typeof value === 'string')
  return record[locale] ?? record[DEFAULT_LOCALE] ?? fallback ?? ''
}
