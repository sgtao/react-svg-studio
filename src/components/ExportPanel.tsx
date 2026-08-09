import { Box, Button, Card, Field, Input, Slider, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useI18n } from '../i18n'
import { downloadBlob, rasterize, safeFilename, toIco, type RasterFormat } from '../lib/export'
import { useSvgDocument } from '../state/svgDocument'

const MIN_SCALE = 0.5
const MAX_SCALE = 8
const ICO_SIZES = [16, 32, 48]

type ExportKind = RasterFormat | 'ico'

const EXTENSIONS: Record<ExportKind, string> = {
  png: 'png',
  jpeg: 'jpg',
  webp: 'webp',
  ico: 'ico',
}

const FORMAT_LABELS: Record<ExportKind, string> = {
  png: 'PNG',
  jpeg: 'JPEG',
  webp: 'WebP',
  ico: 'ICO',
}

const EXPORT_KINDS: ExportKind[] = ['png', 'jpeg', 'webp', 'ico']

export default function ExportPanel() {
  const { t } = useI18n()
  const { source, name, setName, inspection } = useSvgDocument()
  const [scale, setScale] = useState(1)
  const [pending, setPending] = useState<ExportKind | null>(null)
  const [errors, setErrors] = useState<Partial<Record<ExportKind, string>>>({})

  async function handleDownload(kind: ExportKind) {
    setPending(kind)
    setErrors((current) => ({ ...current, [kind]: undefined }))
    try {
      const filename = safeFilename(name, 'asset')
      if (kind === 'ico') {
        const blob = await toIco(source, ICO_SIZES)
        downloadBlob(blob, `${filename}.${EXTENSIONS.ico}`)
      } else {
        const width = Math.round(inspection.width * scale)
        const height = Math.round(inspection.height * scale)
        const blob = await rasterize(source, kind, { width, height })
        downloadBlob(blob, `${filename}.${EXTENSIONS[kind]}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setErrors((current) => ({ ...current, [kind]: message }))
    } finally {
      setPending(null)
    }
  }

  return (
    <Card.Root
      variant="outline"
      bg="colorPalette.subtle"
      borderColor="colorPalette.emphasized"
      borderRadius="2xl"
    >
      <Card.Header>
        <Card.Title color="colorPalette.fg">{t('workbench.export.title')}</Card.Title>
      </Card.Header>
      <Card.Body gap="4">
        <Field.Root>
          <Field.Label>{t('workbench.export.scale')}</Field.Label>
          <Slider.Root
            aria-label={[t('workbench.export.scale')]}
            value={[scale]}
            onValueChange={(details) => setScale(details.value[0])}
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.5}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>
          <Text fontSize="sm" color="fg.muted">
            {scale}×
          </Text>
        </Field.Root>
        <Field.Root>
          <Field.Label>{t('workbench.export.filename')}</Field.Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field.Root>
        <Stack gap="2">
          {EXPORT_KINDS.map((kind) => (
            <Box key={kind}>
              <Button
                type="button"
                borderRadius="full"
                variant="solid"
                disabled={pending === kind}
                onClick={() => handleDownload(kind)}
              >
                ⬇️ {t('export.download', { format: FORMAT_LABELS[kind] })}
              </Button>
              {errors[kind] ? (
                <Text fontSize="sm" color="fg.error">
                  {errors[kind]}
                </Text>
              ) : null}
            </Box>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  )
}
