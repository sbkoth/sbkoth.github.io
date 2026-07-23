# Running the portfolio locally

Terminal-first React SPA with optional Express + Vite middleware for local development. Production remains a pure static build for GitHub Pages.

## Stack

- **Node.js** ≥ 20 (CI uses Node 26)
- **React 19** + **Vite 8** + **TypeScript 7**
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **Express 5** (local only)
- Content: markdown under `content/` → `npm run export:content` → `client/public/data/*.json`

No PostgreSQL or other database is required.

## Setup

```bash
git clone https://github.com/sbkoth/sbkoth.github.io.git
cd sbkoth.github.io
npm install
```

## Development

```bash
npm run dev
```

This runs:

1. `predev` → `tsx scripts/export-content.ts` (Zod-validates and writes static JSON)
2. Express on port **5000** with Vite HMR middleware (`server/index.ts` + `server/vite.ts`)

Open http://localhost:5000/ — you should see the interactive terminal.

### Useful commands

```bash
npm run export:content   # regenerate client/public/data/*.json
npm run check            # tsc
npm test                 # unit tests
npm run lint             # Biome
npm run build:pages      # static client only (what GH Pages deploys)
```

Optional env:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `5000` | Express listen port |
| `VITE_BASE` | `/` | Asset base path (use `/` for user Pages site) |

## Production-like static preview

```bash
npm run build:pages
npx serve dist/public   # or any static file server
```

Confirm:

- Terminal boots with welcome art
- `help`, `about`, `projects`, `services`, `themes`, autocomplete (Tab), history (↑/↓), `clear` / Ctrl+L
- Assets load from `/assets/...` and data from `/data/*.json`
- No console errors

## Content workflow

1. Edit markdown under `content/projects|features|services/` or `content/profile.json`
2. Run `npm run export:content` (or restart `npm run dev`)
3. Invalid frontmatter fails export with Zod path/message details

Schemas live in `shared/schema.ts`.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Empty terminal / “loading data…” forever | Run export; ensure `client/public/data/*.json` exists |
| Typecheck fails after upgrade | `rm -rf node_modules && npm install`, then `npm run check` |
| Styles missing | Tailwind 4 is Vite-plugin based; do not reintroduce `tailwind.config.ts` PostCSS pipeline |
| Express 5 404 on SPA routes | Catch-all uses `/{*path}` (named wildcard) in `server/vite.ts` |
