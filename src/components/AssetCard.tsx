import { Card, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { thumbnailUrl, type SvgAsset, type SvgCategory } from '../content'
import { categoryBadgeColor } from '../theme/colors'

interface AssetCardProps {
  asset: SvgAsset
  category: SvgCategory
  to: string
  isCurrent?: boolean
  size?: 'md' | 'sm'
}

export default function AssetCard({ asset, category, to, isCurrent, size = 'md' }: AssetCardProps) {
  const thumbnailSize = size === 'sm' ? 40 : 64

  return (
    <Card.Root
      asChild
      variant="outline"
      colorPalette={categoryBadgeColor(category.order)}
      bg={isCurrent ? 'colorPalette.muted' : 'colorPalette.subtle'}
      borderColor={isCurrent ? 'colorPalette.solid' : 'colorPalette.emphasized'}
      borderWidth={isCurrent ? '2px' : '1px'}
      borderRadius="xl"
      boxShadow="sm"
      cursor="pointer"
      flexShrink={size === 'sm' ? 0 : undefined}
    >
      <Link to={to} aria-current={isCurrent ? 'page' : undefined}>
        <Card.Body gap="1" alignItems="center" padding={size === 'sm' ? '2' : '3'}>
          <img src={thumbnailUrl(asset)} alt="" width={thumbnailSize} height={thumbnailSize} />
          <Text fontSize="xs" color="colorPalette.fg" truncate>
            {asset.id}
          </Text>
        </Card.Body>
      </Link>
    </Card.Root>
  )
}
