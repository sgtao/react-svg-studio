import manifestJson from './manifest.generated.json'

export interface LocalizedText {
  en: string
  ja: string
  zh: string
  es: string
}

export interface SvgAsset {
  id: string
  category: string
  file: string
  bytes: number
  hash: string
  width: number
  height: number
  tags: string[]
  author: string
  license: string
}

export interface SvgCategory {
  slug: string
  order: number
  license: string
  name: LocalizedText
  description: LocalizedText
  assets: SvgAsset[]
}

interface Manifest {
  generatedAt: string
  categoryCount: number
  assetCount: number
  categories: SvgCategory[]
}

const manifest = manifestJson as Manifest

export interface AssetLookupResult {
  category: SvgCategory
  asset: SvgAsset
}

/** All categories, sorted by their declared `order`. */
export function getCategories(): SvgCategory[] {
  return [...manifest.categories].sort((a, b) => a.order - b.order)
}

/** Finds a category by slug. Returns `undefined` for an unknown or missing slug. */
export function getCategory(slug?: string): SvgCategory | undefined {
  if (!slug) return undefined
  return manifest.categories.find((category) => category.slug === slug)
}

/** Finds an asset by category slug + id. Returns `undefined` if either lookup fails. */
export function getAsset(categorySlug?: string, id?: string): AssetLookupResult | undefined {
  const category = getCategory(categorySlug)
  if (!category || !id) return undefined
  const asset = category.assets.find((item) => item.id === id)
  return asset ? { category, asset } : undefined
}

/** Linear, case-insensitive substring search over asset ids and tags. */
export function searchAssets(query: string): AssetLookupResult[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  const results: AssetLookupResult[] = []
  for (const category of manifest.categories) {
    for (const asset of category.assets) {
      const idMatches = asset.id.toLowerCase().includes(normalized)
      const tagMatches = asset.tags.some((tag) => tag.toLowerCase().includes(normalized))
      if (idMatches || tagMatches) {
        results.push({ asset, category })
      }
    }
  }
  return results
}

const thumbnailUrls = import.meta.glob<string>('/content/svg/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const sourceLoaders = import.meta.glob<string>('/content/svg/**/*.svg', {
  query: '?raw',
  import: 'default',
})

/** URL for `asset`'s thumbnail, suitable for an `<img src>`. */
export function thumbnailUrl(asset: SvgAsset): string {
  const url = thumbnailUrls[asset.file]
  if (!url) {
    throw new Error(`No thumbnail found for asset file: ${asset.file}`)
  }
  return url
}

/** Lazily loads `asset`'s raw SVG markup. */
export function loadSource(asset: SvgAsset): Promise<string> {
  const loader = sourceLoaders[asset.file]
  if (!loader) {
    throw new Error(`No source found for asset file: ${asset.file}`)
  }
  return loader()
}
