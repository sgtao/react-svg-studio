import { Heading, SimpleGrid } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import AssetCard from '../components/AssetCard'
import { getCategory } from '../content'
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
      <Heading as="h1" size="lg" marginBottom="4">
        {t('category.assetsHeading', { name })}
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap="3">
        {category.assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            category={category}
            to={localePath(`/category/${category.slug}/${asset.id}`)}
          />
        ))}
      </SimpleGrid>
    </section>
  )
}
