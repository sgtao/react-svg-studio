import { describe, expect, it } from 'vitest'
import { buildLocalePath, detectLocale, isLocale, localized, resolveLocale, translate } from './core'

describe('isLocale', () => {
  it('accepts the four supported locales', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('ja')).toBe(true)
    expect(isLocale('zh')).toBe(true)
    expect(isLocale('es')).toBe(true)
  })

  it('rejects unsupported or missing values', () => {
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
    expect(isLocale('')).toBe(false)
  })
})

describe('resolveLocale', () => {
  it('reads a supported locale from the first path segment', () => {
    expect(resolveLocale('/ja/category/heart')).toBe('ja')
  })

  it('falls back to English when the segment is unsupported', () => {
    expect(resolveLocale('/fr/category/heart')).toBe('en')
  })

  it('falls back to English for the root path', () => {
    expect(resolveLocale('/')).toBe('en')
  })
})

describe('buildLocalePath', () => {
  it('prefixes the path with the locale', () => {
    expect(buildLocalePath('ja', '/category/heart')).toBe('/ja/category/heart')
  })

  it('adds a leading slash when the given path is missing one', () => {
    expect(buildLocalePath('ja', 'category/heart')).toBe('/ja/category/heart')
  })
})

describe('detectLocale', () => {
  it('picks the first supported locale, matching only the primary subtag', () => {
    expect(detectLocale(['fr-FR', 'ja-JP', 'en-US'])).toBe('ja')
  })

  it('falls back to English when nothing matches', () => {
    expect(detectLocale(['fr-FR', 'de-DE'])).toBe('en')
  })

  it('falls back to English for an empty list', () => {
    expect(detectLocale([])).toBe('en')
  })
})

describe('translate', () => {
  const dictionaries = {
    en: { export: { download: 'Download as {format}' }, only: { english: 'English only' } },
    ja: { export: { download: '{format}でダウンロード' } },
  }

  it('resolves a nested key from the requested locale', () => {
    expect(translate(dictionaries, 'ja', 'export.download')).toBe('{format}でダウンロード')
  })

  it('falls back to English when the key is missing in the requested locale', () => {
    expect(translate(dictionaries, 'ja', 'only.english')).toBe('English only')
  })

  it('falls back to the raw key when missing in every dictionary', () => {
    expect(translate(dictionaries, 'ja', 'nowhere.at.all')).toBe('nowhere.at.all')
  })

  it('substitutes {name} placeholders from vars', () => {
    expect(translate(dictionaries, 'en', 'export.download', { format: 'PNG' })).toBe(
      'Download as PNG',
    )
  })

  it('leaves unmatched placeholders untouched', () => {
    expect(translate(dictionaries, 'en', 'export.download', {})).toBe('Download as {format}')
  })
})

describe('localized', () => {
  it('returns the value for the requested locale', () => {
    expect(localized({ en: 'Heart', ja: 'ハート' }, 'ja')).toBe('ハート')
  })

  it('falls back to English when the requested locale is missing', () => {
    expect(localized({ en: 'Heart' }, 'ja')).toBe('Heart')
  })

  it('falls back to any available value when English is also missing', () => {
    expect(localized({ zh: '心形' }, 'ja')).toBe('心形')
  })
})
