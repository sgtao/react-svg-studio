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
    <section className="source-panel">
      <div className="source-panel__toolbar" role="toolbar">
        <button type="button" onClick={() => setSource(format(source))}>
          {t('workbench.source.format')}
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(source).catch(() => {})
          }}
        >
          {t('workbench.source.copy')}
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              ?.readText()
              .then(setSource)
              .catch(() => {})
          }}
        >
          {t('workbench.source.paste')}
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          {t('workbench.source.openFile')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          hidden
          onChange={handleOpenFile}
        />
        <button
          type="button"
          onClick={() => downloadText(source, `${safeFilename(name, 'image')}.svg`)}
        >
          {t('workbench.source.save')}
        </button>
        <button type="button" onClick={() => setSource('')}>
          {t('workbench.source.clear')}
        </button>
      </div>
      <textarea
        className="source-panel__textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        spellCheck={false}
      />
      {errorMessage ? <p className="source-panel__error">{errorMessage}</p> : null}
    </section>
  )
}
