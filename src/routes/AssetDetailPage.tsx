import { Link, useParams } from 'react-router-dom'
import { getAsset, thumbnailUrl } from '../content'
import { localized, useI18n } from '../i18n'
import NotFoundPage from './NotFoundPage'

export default function AssetDetailPage() {
  const { category: categorySlug, assetId } = useParams()
  const { t, locale, localePath } = useI18n()
  const result = getAsset(categorySlug, assetId)

  if (!result) return <NotFoundPage />

  const { category, asset } = result
  const categoryName = localized(category.name, locale)

  return (
    <section>
      <img src={thumbnailUrl(asset)} alt="" width={128} height={128} />
      <h1>{asset.id}</h1>
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
    </section>
  )
}
