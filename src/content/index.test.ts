import { describe, expect, it } from 'vitest'
import {
  getAsset,
  getCategories,
  getCategory,
  loadSource,
  searchAssets,
  thumbnailUrl,
} from './index'

describe('getCategories', () => {
  it('returns all categories sorted by order', () => {
    const categories = getCategories()
    expect(categories.map((category) => category.slug)).toEqual(['heart', 'star'])
  })
})

describe('getCategory', () => {
  it('finds a category by slug', () => {
    expect(getCategory('star')?.name.en).toBe('Star')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getCategory('unknown')).toBeUndefined()
  })

  it('returns undefined when no slug is given', () => {
    expect(getCategory(undefined)).toBeUndefined()
  })
})

describe('getAsset', () => {
  it('finds an asset within its category', () => {
    const result = getAsset('heart', 'heart-solid')
    expect(result?.asset.id).toBe('heart-solid')
    expect(result?.category.slug).toBe('heart')
  })

  it('returns undefined for an asset id that exists in a different category', () => {
    expect(getAsset('star', 'heart-solid')).toBeUndefined()
  })

  it('returns undefined when the category or id is missing', () => {
    expect(getAsset(undefined, 'heart-solid')).toBeUndefined()
    expect(getAsset('heart', undefined)).toBeUndefined()
  })
})

describe('searchAssets', () => {
  it('matches by id substring, case-insensitively', () => {
    const results = searchAssets('HEART-SOL')
    expect(results.map((r) => r.asset.id)).toEqual(['heart-solid'])
  })

  it('matches by tag substring', () => {
    const results = searchAssets('rating')
    expect(results.map((r) => r.asset.id).sort()).toEqual(['star-outline', 'star-solid'])
  })

  it('returns an empty array for a blank query', () => {
    expect(searchAssets('   ')).toEqual([])
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchAssets('nonexistent')).toEqual([])
  })
})

describe('thumbnailUrl', () => {
  it('returns a non-empty URL for a known asset', () => {
    const { asset } = getAsset('heart', 'heart-solid')!
    expect(thumbnailUrl(asset).length).toBeGreaterThan(0)
  })

  it('throws for an asset whose file is not in the glob (manifest/file mismatch)', () => {
    const { asset } = getAsset('heart', 'heart-solid')!
    expect(() => thumbnailUrl({ ...asset, file: '/content/svg/missing.svg' })).toThrow()
  })
})

describe('loadSource', () => {
  it('resolves the raw SVG markup for a known asset', async () => {
    const { asset } = getAsset('star', 'star-solid')!
    const source = await loadSource(asset)
    expect(source).toContain('<svg')
  })
})
