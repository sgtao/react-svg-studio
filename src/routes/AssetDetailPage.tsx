import { Button, Card, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AssetCard from '../components/AssetCard'
import Workbench from '../components/Workbench'
import { getAsset, loadSource, type SvgAsset } from '../content'
import { localized, useI18n } from '../i18n'
import { categoryBadgeColor } from '../theme/colors'
import NotFoundPage from './NotFoundPage'

/** Loads `asset`'s raw source, resetting to '' while a newly-selected asset's source is in flight. */
function useAssetSource(asset: SvgAsset | undefined): string {
  const [source, setSource] = useState('')

  useEffect(() => {
    if (!asset) return
    let cancelled = false
    setSource('')
    loadSource(asset).then((text) => {
      if (!cancelled) setSource(text)
    })
    return () => {
      cancelled = true
    }
  }, [asset])

  return source
}

export default function AssetDetailPage() {
  const { category: categorySlug, assetId } = useParams()
  const { t, locale, localePath } = useI18n()
  const result = getAsset(categorySlug, assetId)
  const source = useAssetSource(result?.asset)

  if (!result) return <NotFoundPage />

  const { category, asset } = result
  const categoryName = localized(category.name, locale)
  const metaRows: Array<[string, string]> = [
    [t('asset.metaTags'), asset.tags.join(', ')],
    [t('asset.metaAuthor'), asset.author],
    [t('asset.metaLicense'), asset.license],
    [t('asset.metaSize'), `${asset.width}×${asset.height}`],
  ]

  return (
    <Stack as="section" gap="4">
      <Stack as="nav" aria-label={categoryName} gap="2">
        <Heading as="h2" size="sm">
          {t('category.assetsHeading', { name: categoryName })}
        </Heading>
        <HStack overflowX="auto" gap="2" paddingBottom="2">
          {category.assets.map((sibling) => (
            <AssetCard
              key={sibling.id}
              asset={sibling}
              category={category}
              to={localePath(`/category/${category.slug}/${sibling.id}`)}
              isCurrent={sibling.id === asset.id}
              size="sm"
            />
          ))}
        </HStack>
      </Stack>
      <Stack gap="4">
        <Heading as="h1" size="lg">
          {asset.id}
        </Heading>
        <Workbench initialSource={source} initialName={asset.id} />
        <Card.Root
          variant="outline"
          colorPalette={categoryBadgeColor(category.order)}
          bg="colorPalette.subtle"
          borderColor="colorPalette.emphasized"
          borderRadius="2xl"
          boxShadow="sm"
        >
          <Card.Body gap="2">
            {metaRows.map(([label, value]) => (
              <HStack key={label} justify="space-between">
                <Text fontSize="sm" color="fg.muted">
                  {label}
                </Text>
                <Text fontSize="sm" color="colorPalette.fg">
                  {value}
                </Text>
              </HStack>
            ))}
          </Card.Body>
        </Card.Root>
        <Button asChild variant="ghost" size="sm" alignSelf="flex-start">
          <Link to={localePath(`/category/${category.slug}`)}>
            {t('asset.backToCategory', { name: categoryName })}
          </Link>
        </Button>
      </Stack>
    </Stack>
  )
}
