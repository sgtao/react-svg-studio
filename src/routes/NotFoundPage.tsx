import { Button, Card, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function NotFoundPage() {
  const { t, localePath } = useI18n()

  return (
    <Card.Root variant="outline" borderRadius="2xl" boxShadow="sm" maxW="md" marginX="auto">
      <Card.Body gap="3" alignItems="flex-start">
        <Heading as="h1" size="lg">
          {t('notFound.title')}
        </Heading>
        <Text color="fg.muted">{t('notFound.body')}</Text>
        <Button asChild variant="solid" borderRadius="full">
          <Link to={localePath('/')}>{t('notFound.backHome')}</Link>
        </Button>
      </Card.Body>
    </Card.Root>
  )
}
