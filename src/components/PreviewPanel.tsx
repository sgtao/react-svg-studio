import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useI18n } from '../i18n'
import { useSvgDocument } from '../state/svgDocument'

const MIN_SCALE = 0.25
const MAX_SCALE = 8
const ZOOM_STEP = 1.1

interface ViewState {
  scale: number
  x: number
  y: number
}

const INITIAL_VIEW: ViewState = { scale: 1, x: 0, y: 0 }

interface DragState {
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}

export default function PreviewPanel() {
  const { t } = useI18n()
  const { safeSource, inspection } = useSvgDocument()
  const containerRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<ViewState>(INITIAL_VIEW)
  const dragRef = useRef<DragState | null>(null)

  // Ctrl/⌘+wheel zoom must call preventDefault to stop the page from scrolling.
  // React's onWheel is registered as a passive listener, so it cannot preventDefault;
  // a native listener with { passive: false } is required instead.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      setView((current) => {
        const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, current.scale * factor))
        return { ...current, scale }
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y,
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    setView((current) => ({
      ...current,
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    }))
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  const hasContent = inspection.ok && safeSource.trim().length > 0

  return (
    <section className="preview-panel">
      <div
        ref={containerRef}
        className="preview-panel__viewport"
        style={{ position: 'relative', overflow: 'hidden', touchAction: 'none', height: 320 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => setView(INITIAL_VIEW)}
      >
        {hasContent ? (
          <div
            className="preview-panel__canvas"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: inspection.width,
              height: inspection.height,
              transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            }}
            dangerouslySetInnerHTML={{ __html: safeSource }}
          />
        ) : (
          <p className="preview-panel__empty">{t('workbench.preview.empty')}</p>
        )}
      </div>
      <p className="preview-panel__meta">
        {t('workbench.preview.dimensions', {
          width: inspection.width,
          height: inspection.height,
        })}
        {' · '}
        {t('workbench.preview.bytes', { bytes: inspection.bytes })}
      </p>
    </section>
  )
}
