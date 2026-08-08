export interface SvgIssue {
  level: 'error' | 'warning'
  message: string
}

export interface SvgInspection {
  ok: boolean
  width: number
  height: number
  bytes: number
  elementCount: number
  issues: SvgIssue[]
}

const DEFAULT_WIDTH = 300
const DEFAULT_HEIGHT = 150
const ON_ATTR_PATTERN = /^on/i
const JS_URI_PATTERN = /^\s*javascript:/i

/** UTF-8 byte length of `value`. */
export function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

function parseXml(source: string): Document {
  return new DOMParser().parseFromString(source, 'image/svg+xml')
}

function hasParserError(doc: Document): boolean {
  return doc.getElementsByTagName('parsererror').length > 0
}

function parseDimension(value: string | null): number | null {
  if (value === null) return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function inspect(source: string): SvgInspection {
  const bytes = byteLength(source)
  const issues: SvgIssue[] = []
  const doc = parseXml(source)

  if (hasParserError(doc)) {
    issues.push({ level: 'error', message: 'SVGのXMLとして解析できませんでした。' })
    return {
      ok: false,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      bytes,
      elementCount: 0,
      issues,
    }
  }

  const root = doc.documentElement
  if (root.localName !== 'svg') {
    issues.push({ level: 'error', message: 'ルート要素が<svg>ではありません。' })
    return {
      ok: false,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      bytes,
      elementCount: 0,
      issues,
    }
  }

  const elementCount = doc.querySelectorAll('*').length

  const viewBox = root.getAttribute('viewBox')
  let width: number | null = null
  let height: number | null = null

  if (viewBox !== null) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts.every((part) => Number.isFinite(part))) {
      width = parts[2]
      height = parts[3]
    }
  }

  if (width === null || height === null) {
    const attrWidth = parseDimension(root.getAttribute('width'))
    const attrHeight = parseDimension(root.getAttribute('height'))
    if (attrWidth !== null && attrHeight !== null) {
      width = attrWidth
      height = attrHeight
      issues.push({
        level: 'warning',
        message: 'viewBoxがありません（width/height属性を使用しています）。',
      })
    } else {
      width = DEFAULT_WIDTH
      height = DEFAULT_HEIGHT
      issues.push({
        level: 'warning',
        message: 'viewBoxもwidth/heightもありません（既定サイズ 300x150 を使用しています）。',
      })
    }
  }

  return { ok: true, width, height, bytes, elementCount, issues }
}

export function sanitize(source: string): string {
  const doc = parseXml(source)
  if (hasParserError(doc) || doc.documentElement.localName !== 'svg') {
    return ''
  }

  for (const tag of ['script', 'foreignObject']) {
    for (const el of Array.from(doc.getElementsByTagName(tag))) {
      el.remove()
    }
  }

  for (const el of Array.from(doc.querySelectorAll('*'))) {
    for (const attr of Array.from(el.attributes)) {
      if (ON_ATTR_PATTERN.test(attr.name) || JS_URI_PATTERN.test(attr.value)) {
        el.removeAttribute(attr.name)
      }
    }
  }

  return new XMLSerializer().serializeToString(doc)
}

const INDENT_UNIT = '  '

function formatNode(node: Element, depth: number): string {
  const indent = INDENT_UNIT.repeat(depth)
  const attrs = Array.from(node.attributes)
    .map((attr) => ` ${attr.name}="${attr.value}"`)
    .join('')

  const children = Array.from(node.children)
  const textContent = node.children.length === 0 ? (node.textContent ?? '').trim() : ''

  if (children.length === 0) {
    if (textContent) {
      return `${indent}<${node.tagName}${attrs}>${textContent}</${node.tagName}>`
    }
    return `${indent}<${node.tagName}${attrs} />`
  }

  const inner = children.map((child) => formatNode(child, depth + 1)).join('\n')
  return `${indent}<${node.tagName}${attrs}>\n${inner}\n${indent}</${node.tagName}>`
}

/** Re-indents `source`. Returns it unchanged if it cannot be parsed. */
export function format(source: string): string {
  const doc = parseXml(source)
  if (hasParserError(doc) || doc.documentElement.localName !== 'svg') {
    return source
  }
  return formatNode(doc.documentElement, 0)
}
