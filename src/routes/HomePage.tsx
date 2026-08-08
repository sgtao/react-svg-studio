import { Link } from 'react-router-dom'
import { getCategories } from '../content'
import { localized, useI18n } from '../i18n'

export default function HomePage() {
  const { t, locale, localePath } = useI18n()
  const categories = getCategories()

  return (
    <section>
      <h1>{t('home.heroTitle')}</h1>
      <p>{t('home.heroSubtitle')}</p>
      <h2>{t('home.categoriesHeading')}</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link to={localePath(`/category/${category.slug}`)}>
              {localized(category.name, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
