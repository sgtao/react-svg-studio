import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Workbench from '../components/Workbench'
import { getAsset, loadSource, thumbnailUrl, type SvgAsset } from '../content'
import { localized, useI18n } from '../i18n'
import NotFoundPage from './NotFoundPage'

/** Loads `asset`'s raw source, resetting to '' while a newly-selected asset's source is in flight. */
function useAssetSource(asset: SvgAsset | undefined): string {
  const [source, setSource] = useState('')

  useEffect(() => {
    if (!asset) return
    let cancelled = false
    setSource('')
    loadSource(asset).then((text) => {
      if (!cancelled) setSource(text)
    })
    return () => {
      cancelled = true
    }
  }, [asset])

  return source
}

export default function AssetDetailPage() {
  const { category: categorySlug, assetId } = useParams()
  const { t, locale, localePath } = useI18n()
  const result = getAsset(categorySlug, assetId)
  const source = useAssetSource(result?.asset)

  if (!result) return <NotFoundPage />

  const { category, asset } = result
  const categoryName = localized(category.name, locale)

  return (
    <section className="asset-detail">
      <nav className="asset-detail__siblings" aria-label={categoryName}>
        <h2>{t('category.assetsHeading', { name: categoryName })}</h2>
        <ul>
          {category.assets.map((sibling) => (
            <li key={sibling.id}>
              <Link
                to={localePath(`/category/${category.slug}/${sibling.id}`)}
                aria-current={sibling.id === asset.id ? 'page' : undefined}
              >
                <img src={thumbnailUrl(sibling)} alt="" width={64} height={64} />
                {sibling.id}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="asset-detail__main">
        <h1>{asset.id}</h1>
        <Workbench initialSource={source} initialName={asset.id} />
        <dl>
          <dt>{t('asset.metaTags')}</dt>
          <dd>{asset.tags.join(', ')}</dd>
          <dt>{t('asset.metaAuthor')}</dt>
          <dd>{asset.author}</dd>
          <dt>{t('asset.metaLicense')}</dt>
          <dd>{asset.license}</dd>
          <dt>{t('asset.metaSize')}</dt>
          <dd>
            {asset.width}×{asset.height}
          </dd>
        </dl>
        <Link to={localePath(`/category/${category.slug}`)}>
          {t('asset.backToCategory', { name: categoryName })}
        </Link>
      </div>
    </section>
  )
}
