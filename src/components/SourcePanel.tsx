import { Button, Card, Flex, Text, Textarea } from '@chakra-ui/react'
import { useRef, type ChangeEvent } from 'react'
import { useI18n } from '../i18n'
import { downloadText, safeFilename } from '../lib/export'
import { format } from '../lib/svg'
import { useSvgDocument } from '../state/svgDocument'

export default function SourcePanel() {
  const { t } = useI18n()
  const { source, setSource, name, setName, inspection } = useSvgDocument()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const errorMessage = inspection.issues.find((issue) => issue.level === 'error')?.message

  function handleOpenFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    file.text().then((text) => {
      setSource(text)
      setName(file.name.replace(/\.svg$/i, ''))
    })
  }

  return (
    <Card.Root
      variant="outline"
      bg="colorPalette.subtle"
      borderColor="colorPalette.emphasized"
      borderRadius="2xl"
    >
      <Card.Header>
        <Card.Title color="colorPalette.fg">{t('workbench.source.title')}</Card.Title>
      </Card.Header>
      <Card.Body gap="3">
        <Flex role="toolbar" wrap="wrap" gap="2">
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => setSource(format(source))}
          >
            ✨ {t('workbench.source.format')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => {
              navigator.clipboard?.writeText(source).catch(() => {})
            }}
          >
            📋 {t('workbench.source.copy')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => {
              navigator.clipboard
                ?.readText()
                .then(setSource)
                .catch(() => {})
            }}
          >
            📥 {t('workbench.source.paste')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => fileInputRef.current?.click()}
          >
            📂 {t('workbench.source.openFile')}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            hidden
            onChange={handleOpenFile}
          />
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => downloadText(source, `${safeFilename(name, 'image')}.svg`)}
          >
            💾 {t('workbench.source.save')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="subtle"
            borderRadius="full"
            onClick={() => setSource('')}
          >
            🗑️ {t('workbench.source.clear')}
          </Button>
        </Flex>
        <Textarea
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
          fontFamily="mono"
          minH="14em"
        />
        {errorMessage ? <Text color="fg.error">{errorMessage}</Text> : null}
      </Card.Body>
    </Card.Root>
  )
}
