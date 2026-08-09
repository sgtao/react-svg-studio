import { describe, expect, it } from 'vitest'
import { t } from './dictionary'

describe('t (real dictionaries)', () => {
  it('translates a known key in Japanese', () => {
    expect(t('ja', 'common.appName')).toBe('SVGスタジオ')
  })

  it('falls back to English for a locale/key gap and substitutes vars', () => {
    expect(t('es', 'export.download', { format: 'PNG' })).toBe('Descargar como PNG')
  })

  it('returns the raw key when it exists in no dictionary', () => {
    expect(t('en', 'nope.not.here')).toBe('nope.not.here')
  })

  it('translates workbench panel titles across locales', () => {
    expect(t('en', 'workbench.source.title')).toBe('Source')
    expect(t('ja', 'workbench.preview.title')).toBe('プレビュー')
    expect(t('zh', 'workbench.export.title')).toBe('导出')
  })
})
