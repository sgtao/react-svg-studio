import { describe, expect, it } from 'vitest'
import { byteLength, format, inspect, sanitize } from './svg'

describe('byteLength', () => {
  it('counts ASCII characters as one byte each', () => {
    expect(byteLength('hello')).toBe(5)
  })

  it('counts multi-byte UTF-8 characters correctly', () => {
    // '愛' is 3 bytes in UTF-8
    expect(byteLength('愛')).toBe(3)
  })

  it('returns 0 for an empty string', () => {
    expect(byteLength('')).toBe(0)
  })
})

describe('inspect', () => {
  it('reads width/height from viewBox when present', () => {
    const result = inspect('<svg viewBox="0 0 24 32"><rect /></svg>')
    expect(result.ok).toBe(true)
    expect(result.width).toBe(24)
    expect(result.height).toBe(32)
    expect(result.issues).toEqual([])
  })

  it('falls back to width/height attributes when viewBox is missing', () => {
    const result = inspect('<svg width="100" height="50"><rect /></svg>')
    expect(result.ok).toBe(true)
    expect(result.width).toBe(100)
    expect(result.height).toBe(50)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ level: 'warning' }),
    )
  })

  it('falls back to 300x150 when neither viewBox nor width/height are present', () => {
    const result = inspect('<svg><rect /></svg>')
    expect(result.ok).toBe(true)
    expect(result.width).toBe(300)
    expect(result.height).toBe(150)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ level: 'warning' }),
    )
  })

  it('reports the UTF-8 byte length', () => {
    const source = '<svg viewBox="0 0 10 10"></svg>'
    const result = inspect(source)
    expect(result.bytes).toBe(byteLength(source))
  })

  it('counts elements including the root svg', () => {
    const result = inspect(
      '<svg viewBox="0 0 10 10"><g><rect /><circle /></g></svg>',
    )
    expect(result.elementCount).toBe(4) // svg, g, rect, circle
  })

  it('classifies unparseable XML as not ok with an error issue', () => {
    const result = inspect('<svg><rect></svg>')
    expect(result.ok).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ level: 'error' }),
    )
  })

  it('classifies a non-svg root element as not ok with an error issue', () => {
    const result = inspect('<div>not an svg</div>')
    expect(result.ok).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({ level: 'error' }),
    )
  })
})

describe('sanitize', () => {
  it('removes script elements', () => {
    const result = sanitize(
      '<svg viewBox="0 0 10 10"><script>alert(1)</script><rect /></svg>',
    )
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert')
    expect(result).toContain('<rect')
  })

  it('removes foreignObject elements', () => {
    const result = sanitize(
      '<svg viewBox="0 0 10 10"><foreignObject><p>hi</p></foreignObject><rect /></svg>',
    )
    expect(result).not.toContain('foreignObject')
    expect(result).toContain('<rect')
  })

  it('removes on* event handler attributes', () => {
    const result = sanitize(
      '<svg viewBox="0 0 10 10"><rect onclick="alert(1)" fill="red" /></svg>',
    )
    expect(result).not.toContain('onclick')
    expect(result).toContain('fill="red"')
  })

  it('removes javascript: URIs from attributes', () => {
    const result = sanitize(
      '<svg viewBox="0 0 10 10"><a href="javascript:alert(1)"><rect /></a></svg>',
    )
    expect(result).not.toContain('javascript:')
  })

  it('leaves safe markup untouched', () => {
    const result = sanitize(
      '<svg viewBox="0 0 10 10"><rect fill="red" width="5" height="5" /></svg>',
    )
    expect(result).toContain('fill="red"')
    expect(result).toContain('width="5"')
  })

  it('returns an empty string for unparseable input', () => {
    expect(sanitize('<svg><rect></svg>')).toBe('')
  })
})

describe('format', () => {
  it('re-indents nested elements', () => {
    const result = format(
      '<svg viewBox="0 0 10 10"><g><rect/></g></svg>',
    )
    expect(result).toContain('\n')
    expect(result).toMatch(/<g>\n\s+<rect/)
  })

  it('returns unparseable input unchanged', () => {
    const broken = '<svg><rect></svg>'
    expect(format(broken)).toBe(broken)
  })
})
