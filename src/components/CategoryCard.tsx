import { Card, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import type { SvgCategory } from '../content'
import { localized, useI18n } from '../i18n'
import { categoryBadgeColor } from '../theme/colors'

interface CategoryCardProps {
  category: SvgCategory
  variant: 'compact' | 'full'
}

export default function CategoryCard({ category, variant }: CategoryCardProps) {
  const { locale, localePath } = useI18n()
  const name = localized(category.name, locale)

  return (
    <Card.Root
      asChild
      variant="outline"
      colorPalette={categoryBadgeColor(category.order)}
      bg="colorPalette.subtle"
      borderColor="colorPalette.emphasized"
      borderRadius="2xl"
      boxShadow="sm"
      cursor="pointer"
    >
      <Link to={localePath(`/category/${category.slug}`)}>
        <Card.Body gap="2">
          <Card.Title color="colorPalette.fg">{name}</Card.Title>
          {variant === 'full' ? (
            <Text fontSize="sm" color="fg.muted">
              {localized(category.description, locale)}
            </Text>
          ) : null}
        </Card.Body>
      </Link>
    </Card.Root>
  )
}
