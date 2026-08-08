import { Link } from 'react-router-dom'
import { getCategories } from '../content'
import { localized, useI18n } from '../i18n'

export default function CollectionPage() {
  const { t, locale, localePath } = useI18n()
  const categories = getCategories()

  return (
    <section>
      <h1>{t('category.listHeading')}</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link to={localePath(`/category/${category.slug}`)}>
              {localized(category.name, locale)}
            </Link>
            <p>{localized(category.description, locale)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
