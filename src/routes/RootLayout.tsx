import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { LOCALES, detectLocale, isLocale, useI18n } from '../i18n'

/** Element for both `/` and `/:lang`: redirects to a detected locale when `:lang` is missing or unsupported. */
export default function RootLayout() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, localePath } = useI18n()

  useEffect(() => {
    if (!isLocale(lang)) {
      const languages = typeof navigator === 'undefined' ? [] : navigator.languages
      navigate(`/${detectLocale(languages)}`, { replace: true })
    }
  }, [lang, navigate])

  useEffect(() => {
    if (isLocale(lang)) {
      document.documentElement.lang = lang
      document.documentElement.dir = 'ltr'
    }
  }, [lang])

  if (!isLocale(lang)) return null

  const segments = location.pathname.split('/')

  return (
    <>
      <header>
        <Link to={localePath('/')}>{t('common.appName')}</Link>
        <nav>
          <Link to={localePath('/')}>{t('nav.home')}</Link>
          <Link to={localePath('/category')}>{t('nav.categories')}</Link>
        </nav>
        <nav aria-label="Language">
          {LOCALES.map((locale) => {
            const target = [...segments]
            target[1] = locale
            return (
              <Link key={locale} to={target.join('/') || '/'}>
                {t(`common.localeNames.${locale}`)}
              </Link>
            )
          })}
        </nav>
      </header>
      <Outlet />
    </>
  )
}
