import { Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import CategoryCard from '../components/CategoryCard'
import Workbench from '../components/Workbench'
import { getCategories } from '../content'
import { useI18n } from '../i18n'

const SAMPLE_TRIANGLE_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,10 90,90 10,90" fill="#6366f1" />
</svg>`

export default function HomePage() {
  const { t } = useI18n()
  const categories = getCategories()

  return (
    <Stack as="section" gap="6">
      <Stack gap="2">
        <Heading as="h1" size="2xl">
          {t('home.heroTitle')}
        </Heading>
        <Text color="fg.muted">{t('home.heroSubtitle')}</Text>
      </Stack>
      <Workbench initialSource={SAMPLE_TRIANGLE_SVG} initialName="triangle" />
      <Heading as="h2" size="md">
        {t('home.categoriesHeading')}
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 3, lg: 4 }} gap="3">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} variant="compact" />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
