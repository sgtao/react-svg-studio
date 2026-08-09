import { Link } from 'react-router-dom'
import Workbench from '../components/Workbench'
import { getCategories } from '../content'
import { localized, useI18n } from '../i18n'

const SAMPLE_TRIANGLE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,10 90,90 10,90" fill="#6366f1" />
</svg>`

export default function HomePage() {
  const { t, locale, localePath } = useI18n()
  const categories = getCategories()

  return (
    <section>
      <h1>{t('home.heroTitle')}</h1>
      <p>{t('home.heroSubtitle')}</p>
      <Workbench initialSource={SAMPLE_TRIANGLE_SVG} initialName="triangle" />
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
