import { Button, Flex, HStack, Heading } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import AppearanceMenu from '../components/AppearanceMenu'
import LanguageMenu from '../components/LanguageMenu'
import { detectLocale, isLocale, useI18n } from '../i18n'

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
      <Flex as="header" justify="space-between" align="center" wrap="wrap" gap="3" paddingY="4">
        <HStack gap="3">
          <Button asChild variant="plain" paddingInline="0">
            <Link to={localePath('/')}>
              <Heading as="span" size="md">
                {t('common.appName')}
              </Heading>
            </Link>
          </Button>
          <HStack as="nav" gap="1">
            <Button asChild variant="ghost" size="sm" borderRadius="full">
              <Link to={localePath('/')}>{t('nav.home')}</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" borderRadius="full">
              <Link to={localePath('/category')}>{t('nav.categories')}</Link>
            </Button>
          </HStack>
        </HStack>
        <HStack gap="2">
          <LanguageMenu segments={segments} />
          <AppearanceMenu />
        </HStack>
      </Flex>
      <Outlet />
    </>
  )
}
