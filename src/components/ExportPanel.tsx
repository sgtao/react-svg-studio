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
    <section className="export-panel">
      <label className="export-panel__field">
        {t('workbench.export.scale')}
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.5}
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
        />
        <span>{scale}×</span>
      </label>
      <label className="export-panel__field">
        {t('workbench.export.filename')}
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <ul className="export-panel__formats">
        {EXPORT_KINDS.map((kind) => (
          <li key={kind}>
            <button type="button" disabled={pending === kind} onClick={() => handleDownload(kind)}>
              {t('export.download', { format: FORMAT_LABELS[kind] })}
            </button>
            {errors[kind] ? <p className="export-panel__error">{errors[kind]}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
