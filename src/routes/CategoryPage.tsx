import { Link, useParams } from 'react-router-dom'
import { getCategory, thumbnailUrl } from '../content'
import { localized, useI18n } from '../i18n'
import NotFoundPage from './NotFoundPage'

export default function CategoryPage() {
  const { category: categorySlug } = useParams()
  const { t, locale, localePath } = useI18n()
  const category = getCategory(categorySlug)

  if (!category) return <NotFoundPage />

  const name = localized(category.name, locale)

  return (
    <section>
      <h1>{t('category.assetsHeading', { name })}</h1>
      <ul>
        {category.assets.map((asset) => (
          <li key={asset.id}>
            <Link to={localePath(`/category/${category.slug}/${asset.id}`)}>
              <img src={thumbnailUrl(asset)} alt="" width={64} height={64} />
              {asset.id}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
