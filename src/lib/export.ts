import { sanitize } from './svg'

export type RasterFormat = 'png' | 'jpeg' | 'webp'

export interface RasterizeOptions {
  width: number
  height: number
  background?: string
  quality?: number
}

export interface IcoEntry {
  size: number
  data: Uint8Array<ArrayBuffer>
}

const MIME_TYPES: Record<RasterFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

/** Renders `source` onto a canvas and encodes it as `format`. Requires a real browser canvas. */
export function rasterize(
  source: string,
  format: RasterFormat,
  options: RasterizeOptions,
): Promise<Blob> {
  const svgBlob = new Blob([sanitize(source)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(svgBlob)

  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = options.width
      canvas.height = options.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('2D canvas context is not available.'))
        return
      }

      const background = options.background ?? (format === 'jpeg' ? '#ffffff' : undefined)
      if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, options.width, options.height)
      }
      ctx.drawImage(img, 0, 0, options.width, options.height)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error('Failed to encode the canvas as a Blob.'))
        },
        MIME_TYPES[format],
        options.quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load the SVG source as an image.'))
    }

    img.src = url
  })
}

const ICONDIR_SIZE = 6
const ICONDIRENTRY_SIZE = 16

/** Builds an ICO file from pre-encoded PNG entries. Canvas-independent, byte-level. */
export function buildIco(entries: IcoEntry[]): Uint8Array<ArrayBuffer> {
  const dirSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE * entries.length
  const totalSize = dirSize + entries.reduce((sum, entry) => sum + entry.data.length, 0)

  const bytes = new Uint8Array(totalSize)
  const view = new DataView(bytes.buffer)

  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type: icon
  view.setUint16(4, entries.length, true)

  let dataOffset = dirSize
  entries.forEach((entry, index) => {
    const entryOffset = ICONDIR_SIZE + index * ICONDIRENTRY_SIZE
    const dimension = entry.size >= 256 ? 0 : entry.size

    view.setUint8(entryOffset + 0, dimension) // width
    view.setUint8(entryOffset + 1, dimension) // height
    view.setUint8(entryOffset + 2, 0) // color count
    view.setUint8(entryOffset + 3, 0) // reserved
    view.setUint16(entryOffset + 4, 1, true) // color planes
    view.setUint16(entryOffset + 6, 32, true) // bits per pixel
    view.setUint32(entryOffset + 8, entry.data.length, true) // bytes in resource
    view.setUint32(entryOffset + 12, dataOffset, true) // image offset

    bytes.set(entry.data, dataOffset)
    dataOffset += entry.data.length
  })

  return bytes
}

/** Rasterizes `source` at each size in `sizes` and packs the results into a single .ico Blob. */
export async function toIco(source: string, sizes: number[]): Promise<Blob> {
  const entries: IcoEntry[] = []
  for (const size of sizes) {
    const blob = await rasterize(source, 'png', { width: size, height: size })
    entries.push({ size, data: new Uint8Array(await blob.arrayBuffer()) })
  }
  return new Blob([buildIco(entries)], { type: 'image/x-icon' })
}

/** Creates a temporary `<a download>` for `blob` and clicks it. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/** Wraps `text` in a Blob and downloads it via {@link downloadBlob}. */
export function downloadText(
  text: string,
  filename: string,
  mimeType = 'image/svg+xml',
): void {
  downloadBlob(new Blob([text], { type: mimeType }), filename)
}

const INVALID_FILENAME_CHARS = new Set(['<', '>', ':', '"', '/', '\\', '|', '?', '*'])

/** Strips characters that are invalid in filenames; returns `fallback` if nothing is left. */
export function safeFilename(value: string, fallback: string): string {
  const cleaned = Array.from(value)
    .filter((char) => (char.codePointAt(0) ?? 0) > 0x1f && !INVALID_FILENAME_CHARS.has(char))
    .join('')
    .trim()
  return cleaned.length > 0 ? cleaned : fallback
}
