import { afterEach, describe, expect, it } from 'vitest'
import { buildIco, downloadBlob, downloadText, safeFilename } from './export'

describe('buildIco', () => {
  it('writes the ICONDIR header (reserved=0, type=1, count)', () => {
    const bytes = buildIco([{ size: 16, data: new Uint8Array([1, 2, 3]) }])
    const view = new DataView(bytes.buffer)
    expect(view.getUint16(0, true)).toBe(0) // reserved
    expect(view.getUint16(2, true)).toBe(1) // type = icon
    expect(view.getUint16(4, true)).toBe(1) // count
  })

  it('writes width/height/bytesInRes/offset for each ICONDIRENTRY', () => {
    const first = new Uint8Array([1, 2, 3, 4])
    const second = new Uint8Array([9, 9])
    const bytes = buildIco([
      { size: 16, data: first },
      { size: 32, data: second },
    ])
    const view = new DataView(bytes.buffer)
    const dirSize = 6 + 16 * 2

    // first entry at offset 6
    expect(view.getUint8(6 + 0)).toBe(16) // width
    expect(view.getUint8(6 + 1)).toBe(16) // height
    expect(view.getUint32(6 + 8, true)).toBe(first.length) // bytesInRes
    expect(view.getUint32(6 + 12, true)).toBe(dirSize) // imageOffset

    // second entry at offset 6 + 16
    expect(view.getUint8(6 + 16 + 0)).toBe(32)
    expect(view.getUint32(6 + 16 + 8, true)).toBe(second.length)
    expect(view.getUint32(6 + 16 + 12, true)).toBe(dirSize + first.length)
  })

  it('encodes a 256px entry as 0 in the width/height bytes', () => {
    const bytes = buildIco([{ size: 256, data: new Uint8Array([1]) }])
    const view = new DataView(bytes.buffer)
    expect(view.getUint8(6 + 0)).toBe(0)
    expect(view.getUint8(6 + 1)).toBe(0)
  })

  it('places each entry’s image data at its recorded offset', () => {
    const first = new Uint8Array([1, 2, 3, 4])
    const second = new Uint8Array([9, 9])
    const bytes = buildIco([
      { size: 16, data: first },
      { size: 32, data: second },
    ])
    const dirSize = 6 + 16 * 2
    expect(bytes.slice(dirSize, dirSize + first.length)).toEqual(first)
    expect(
      bytes.slice(dirSize + first.length, dirSize + first.length + second.length),
    ).toEqual(second)
  })
})

describe('downloadBlob / downloadText', () => {
  const originalClick = HTMLAnchorElement.prototype.click
  const clicks: HTMLAnchorElement[] = []

  afterEach(() => {
    HTMLAnchorElement.prototype.click = originalClick
    clicks.length = 0
  })

  it('creates a temporary <a download> and clicks it with the given filename', () => {
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      clicks.push(this)
    }
    downloadBlob(new Blob(['hello']), 'note.txt')
    expect(clicks).toHaveLength(1)
    expect(clicks[0].download).toBe('note.txt')
  })

  it('wraps text in a Blob and downloads it with the given filename', () => {
    HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
      clicks.push(this)
    }
    downloadText('<svg></svg>', 'shape.svg')
    expect(clicks).toHaveLength(1)
    expect(clicks[0].download).toBe('shape.svg')
  })
})

describe('safeFilename', () => {
  it('removes characters that are invalid in filenames', () => {
    expect(safeFilename('my:icon*name?.svg', 'fallback')).toBe('myiconname.svg')
  })

  it('trims surrounding whitespace', () => {
    expect(safeFilename('  heart  ', 'fallback')).toBe('heart')
  })

  it('falls back when the cleaned result is empty', () => {
    expect(safeFilename('???', 'fallback')).toBe('fallback')
  })
})
