# Srinivas Kothapalli — Terminal Portfolio

Personal portfolio site for tech leadership, data platforms, streaming, cloud, and AI work. Content is authored as markdown under `content/` and exported to static JSON for free [GitHub Pages](https://pages.github.com/) hosting.

**Live site:** https://sbkoth.github.io/

## Stack (v3)

| Layer | Choice |
|-------|--------|
| UI | React 19 + interactive terminal (primary UX) |
| Build | Vite 8 + TypeScript 7 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`, CSS-first `@theme`) |
| Data | TanStack Query (static JSON, `staleTime: Infinity`) |
| Content | Markdown + gray-matter → Zod-validated static JSON |
| Security | `marked` + `isomorphic-dompurify` for dialog HTML |
| Lint/format | Biome |
| Local dev | Optional Express 5 + Vite middleware |
| Production | Pure static SPA on GitHub Pages (`base` `/`) |

No runtime Node/Express/Postgres is required for production.

## Content

| Path | Purpose |
|------|---------|
| `content/profile.json` | Name, title, bio, avatar, socials |
| `content/projects/*.md` | Project cards (frontmatter + markdown body) |
| `content/features/*.md` | Professional expertise cards |
| `content/services/*.md` | Service offerings |
| `uploads/` | Images and files referenced as `/uploads/...` |

Run `npm run export:content` (also runs on `predev` / `prebuild`) to materialize `client/public/data/*.json` and copy uploads. Export validates every shape with Zod schemas in `shared/schema.ts`.

## Scripts

```bash
npm install
npm run dev          # export content + Express + Vite HMR on port 5000
npm run check        # TypeScript
npm test             # unit tests (commands, sanitize, export, themes, …)
npm run lint         # Biome check
npm run build        # static export + Vite client + optional server bundle
npm run build:pages  # client-only static build for Pages (VITE_BASE=/)
```

Production base path is **`/`** (user site `sbkoth.github.io`).

## Terminal commands

Type `help` in the live terminal. Dispatch is data-driven from `COMMAND_REGISTRY` in `client/src/terminal/commands.ts` (handlers + help metadata + autocomplete).

## Deploy (GitHub Pages — free)

Repo: **https://github.com/sbkoth/sbkoth.github.io**

`.github/workflows/deploy-pages.yml` runs:

1. `npm ci`
2. `npm run export:content`
3. `npm run check` + `npm test`
4. `VITE_BASE=/ npx vite build`
5. Publish `dist/public` to the **`gh-pages`** branch

**Pages source:** Settings → Pages → Deploy from a branch → **`gh-pages`** / **`/ (root)`**.

Live: **https://sbkoth.github.io/**

## Security notes

- Markdown/HTML rendered in dialogs is sanitized (`client/src/lib/sanitize-markdown.ts`).
- External navigations use `rel="noopener noreferrer"`.
- Static site includes a restrictive CSP meta tag in `client/index.html`.
- Treat repo Markdown as untrusted for rendering purposes.

## Migration notes (v2 → v3)

- Vite 6 → 8, TypeScript → 7, Tailwind 3 → 4 (`@import "tailwindcss"`, `@theme` tokens).
- Zod 3 → 4; export pipeline validates with shared schemas.
- Heavy unused shadcn/Radix surface (recharts, carousel, day-picker, …) pruned.
- Command switch replaced by registry/map; Terminal hooks extracted to `hooks.ts`.
- Marketing-era components (`hero`, `project-grid`, `features`, …) removed; only
  `content-dialog` + `ui/dialog` remain under `client/src/components/` for the
  sanitized markdown dialog path. Theme tokens live in `terminal/themes.ts`.
