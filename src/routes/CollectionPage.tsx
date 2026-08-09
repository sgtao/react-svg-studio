import { Heading, SimpleGrid } from '@chakra-ui/react'
import CategoryCard from '../components/CategoryCard'
import { getCategories } from '../content'
import { useI18n } from '../i18n'

export default function CollectionPage() {
  const { t } = useI18n()
  const categories = getCategories()

  return (
    <section>
      <Heading as="h1" size="lg" marginBottom="4">
        {t('category.listHeading')}
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} variant="full" />
        ))}
      </SimpleGrid>
    </section>
  )
}
