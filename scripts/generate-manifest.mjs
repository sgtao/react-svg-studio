import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const SVG_DIR = join(CONTENT_DIR, 'svg');
const CATEGORIES_JSON = join(CONTENT_DIR, 'categories.json');
const OUTPUT_PATH = join(ROOT, 'src/content/manifest.generated.json');

function fail(errors) {
  console.error('manifest generation failed:');
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}

function parseDimensions(source) {
  const viewBoxMatch = source.match(/viewBox\s*=\s*"([^"]+)"/);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      return { width: parts[2], height: parts[3] };
    }
  }
  const widthMatch = source.match(/\bwidth\s*=\s*"(\d+(?:\.\d+)?)"/);
  const heightMatch = source.match(/\bheight\s*=\s*"(\d+(?:\.\d+)?)"/);
  if (widthMatch && heightMatch) {
    return { width: Number(widthMatch[1]), height: Number(heightMatch[1]) };
  }
  return { width: 300, height: 150 };
}

function main() {
  const errors = [];

  if (!existsSync(CATEGORIES_JSON)) {
    fail([`content/categories.json not found at ${CATEGORIES_JSON}`]);
  }
  const definedCategories = JSON.parse(readFileSync(CATEGORIES_JSON, 'utf8')).categories ?? [];
  const definedSlugs = new Set(definedCategories.map((c) => c.slug));

  const actualDirs = existsSync(SVG_DIR)
    ? readdirSync(SVG_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];
  for (const dir of actualDirs) {
    if (!definedSlugs.has(dir)) {
      errors.push(`content/svg/${dir} has no matching category in categories.json`);
    }
  }

  const hashToAssetIds = new Map();
  const outputCategories = [];

  for (const category of [...definedCategories].sort((a, b) => a.order - b.order)) {
    const categoryDir = join(SVG_DIR, category.slug);
    if (!existsSync(categoryDir)) {
      errors.push(`category "${category.slug}" is defined but content/svg/${category.slug} does not exist`);
      continue;
    }

    const outputAssets = [];
    for (const asset of category.assets ?? []) {
      const filePath = join(categoryDir, `${asset.id}.svg`);
      if (!existsSync(filePath)) {
        errors.push(`asset "${category.slug}/${asset.id}" is defined but ${filePath} does not exist`);
        continue;
      }

      const license = asset.license ?? category.license;
      const author = asset.author;
      if (!license) errors.push(`asset "${category.slug}/${asset.id}" is missing a license`);
      if (!author) errors.push(`asset "${category.slug}/${asset.id}" is missing an author`);
      if (!license || !author) continue;

      const source = readFileSync(filePath, 'utf8');
      const bytes = Buffer.byteLength(source, 'utf8');
      const hash = createHash('sha256').update(source).digest('hex').slice(0, 8);
      const { width, height } = parseDimensions(source);

      const assetId = `${category.slug}/${asset.id}`;
      if (!hashToAssetIds.has(hash)) hashToAssetIds.set(hash, []);
      hashToAssetIds.get(hash).push(assetId);

      outputAssets.push({
        id: asset.id,
        category: category.slug,
        file: `/content/svg/${category.slug}/${asset.id}.svg`,
        bytes,
        hash,
        width,
        height,
        tags: asset.tags ?? [],
        author,
        license,
      });
    }

    outputCategories.push({
      slug: category.slug,
      order: category.order,
      license: category.license,
      name: category.name,
      description: category.description,
      assets: outputAssets,
    });
  }

  if (errors.length > 0) fail(errors);

  for (const [hash, ids] of hashToAssetIds) {
    if (ids.length > 1) {
      console.warn(`warning: duplicate content hash ${hash} shared by ${ids.join(', ')}`);
    }
  }

  const assetCount = outputCategories.reduce((sum, c) => sum + c.assets.length, 0);
  const manifest = {
    generatedAt: new Date().toISOString(),
    categoryCount: outputCategories.length,
    assetCount,
    categories: outputCategories,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`manifest generated: ${outputCategories.length} categories, ${assetCount} assets`);
}

main();
