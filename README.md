# React SVG Studio

A browser-only SVG viewer, converter, and curated icon collection, built with React + Vite. There is no backend: every file you open stays in your browser and is never uploaded anywhere.

**Live demo:** https://sgtao.github.io/react-svg-studio/

## Features

- **SVG workbench** — paste or edit raw SVG source, preview it live, and export as SVG or a scaled raster image, all client-side.
- **Asset collection** — browse categorized, hand-picked SVG icons with per-asset license and tag metadata.
- **Internationalized UI** — English, Japanese, Traditional Chinese, and Spanish, selectable via URL (`/en/…`, `/ja/…`, `/zh/…`, `/es/…`).
- **Theming** — light/dark mode plus a choice of three accent colors (Lime, Mint, Sky), built on Chakra UI.

## Tech Stack

React 19 · TypeScript · Vite · React Router · Chakra UI · Vitest

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs the content pipeline first, then starts Vite with hot reload.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (regenerates content manifest first) |
| `npm run content` | Regenerate `src/content/manifest.generated.json` from `content/` |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm test` | Run the unit test suite (Vitest + jsdom) |
| `npm run typecheck` | Type-check only |
| `npm run lint` | Lint with oxlint |

Adding or removing a file under `content/` has no effect until `npm run content` (or `npm run dev` / `npm run build`, which run it automatically) regenerates the manifest.

## Project Structure

| Path | Responsibility |
|---|---|
| `content/` | Source SVG assets and category definitions — the only place to edit content |
| `scripts/generate-manifest.mjs` | Builds `src/content/manifest.generated.json` from `content/` |
| `src/lib/` | Pure SVG parsing/transform functions, no React |
| `src/content/` | The single entry point for reading content (never import the generated manifest directly) |
| `src/state/` | Document state — the SVG source is the single source of truth; validation results are derived |
| `src/i18n/` | Locale dictionaries and locale detection |
| `src/components/` | UI components |
| `src/theme/` | Chakra UI theme customization and the accent-color provider |
| `src/routes/` | URL-to-screen mapping (React Router) |

## Content & Licensing

Every asset in `content/` carries its own `license` field in `content/categories.json`; the bundled starter set is `CC0-1.0`.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

🤖 Built with [Claude.ai](https://claude.ai/)
