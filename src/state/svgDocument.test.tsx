import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { inspect, sanitize } from '../lib/svg'
import { SvgDocumentProvider, useSvgDocument, type SvgDocumentState } from './svgDocument'

const SOURCE_A = '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>'
const SOURCE_B = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>'

let container: HTMLDivElement
let root: Root
let latest: SvgDocumentState | null

function Probe() {
  latest = useSvgDocument()
  return null
}

function renderProvider(initialSource: string, initialName: string) {
  act(() => {
    root.render(
      <SvgDocumentProvider initialSource={initialSource} initialName={initialName}>
        <Probe />
      </SvgDocumentProvider>,
    )
  })
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  latest = null
})

afterEach(() => {
  act(() => {
    root.unmount()
  })
  container.remove()
})

describe('SvgDocumentProvider', () => {
  it('exposes initialSource/initialName and their derived values on mount', () => {
    renderProvider(SOURCE_A, 'shape-a')

    expect(latest?.source).toBe(SOURCE_A)
    expect(latest?.name).toBe('shape-a')
    expect(latest?.inspection).toEqual(inspect(SOURCE_A))
    expect(latest?.safeSource).toBe(sanitize(SOURCE_A))
  })

  it('recomputes inspection/safeSource when setSource is called', () => {
    renderProvider(SOURCE_A, 'shape-a')

    act(() => {
      latest?.setSource(SOURCE_B)
    })

    expect(latest?.source).toBe(SOURCE_B)
    expect(latest?.name).toBe('shape-a')
    expect(latest?.inspection).toEqual(inspect(SOURCE_B))
    expect(latest?.safeSource).toBe(sanitize(SOURCE_B))
  })

  it('resets source/name to the new initial values when initialSource/initialName change', () => {
    renderProvider(SOURCE_A, 'shape-a')

    act(() => {
      latest?.setSource('<svg><rect x="1" /></svg>')
    })
    expect(latest?.source).not.toBe(SOURCE_A)

    renderProvider(SOURCE_B, 'shape-b')

    expect(latest?.source).toBe(SOURCE_B)
    expect(latest?.name).toBe('shape-b')
    expect(latest?.inspection).toEqual(inspect(SOURCE_B))
    expect(latest?.safeSource).toBe(sanitize(SOURCE_B))
  })

  it('does not reset when re-rendered with the same initialSource/initialName', () => {
    renderProvider(SOURCE_A, 'shape-a')

    act(() => {
      latest?.setSource(SOURCE_B)
    })

    renderProvider(SOURCE_A, 'shape-a')

    expect(latest?.source).toBe(SOURCE_B)
  })
})

describe('useSvgDocument', () => {
  it('throws when called outside a SvgDocumentProvider', () => {
    function Bare() {
      useSvgDocument()
      return null
    }

    expect(() => {
      act(() => {
        root.render(<Bare />)
      })
    }).toThrow('useSvgDocument must be used within a SvgDocumentProvider')
  })
})
