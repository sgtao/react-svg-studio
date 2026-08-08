import en from './locales/en.json'
import es from './locales/es.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import { translate, type Dictionary, type Locale } from './core'

const dictionaries: Record<Locale, Dictionary> = { en, ja, zh, es }

/** Translates `key` for `locale` against the real locale dictionaries. See {@link translate}. */
export function t(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  return translate(dictionaries, locale, key, vars)
}
