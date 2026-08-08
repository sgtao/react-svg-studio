import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function NotFoundPage() {
  const { t, localePath } = useI18n()

  return (
    <section>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <Link to={localePath('/')}>{t('notFound.backHome')}</Link>
    </section>
  )
}
