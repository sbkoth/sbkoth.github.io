# Srinivas Kothapalli — Portfolio

Personal portfolio site for tech leadership, data platforms, streaming, cloud, and AI work. Content is authored as markdown under `content/` and exported to static JSON for free [GitHub Pages](https://pages.github.com/) hosting.

**Live site:** https://sbkoth.github.io/sbkoth-intro-page/

## Stack

- React 19 + Vite 6 + TypeScript + Tailwind CSS 3
- TanStack Query for client data loading
- Static content export (no runtime Node/Express/Postgres required for production)
- Optional Express server for local development

## Content

| Path | Purpose |
|------|---------|
| `content/profile.json` | Name, title, bio, avatar, socials |
| `content/projects/*.md` | Project cards (frontmatter + markdown body) |
| `content/features/*.md` | Professional expertise cards |
| `content/services/*.md` | Service offerings |
| `uploads/` | Images and files referenced as `/uploads/...` |

Run `npm run export:content` (also runs on `predev` / `prebuild`) to materialize `client/public/data/*.json` and copy uploads.

## Scripts

```bash
npm install
npm run dev          # export content + Express + Vite HMR on port 5000
npm run check        # TypeScript
npm test             # content export + path helper unit tests
npm run build        # static export + Vite client + optional server bundle
npm run build:pages  # client-only static build for Pages
```

The production build uses a **root-relative** base (`./` in `vite.config.ts`). The app is served from the root of its deployment directory (routes `/`, assets `./assets/*`, data `./data/*`) so it works at:

- https://sbkoth.github.io/sbkoth-intro-page/ (project Pages), and  
- a user site or custom domain at `/` if you host there later.

## Deploy (GitHub Pages — free)

`.github/workflows/deploy-pages.yml` builds with `VITE_BASE=./` and publishes to the **`gh-pages`** branch on every push to `main`.

**Pages source:** Settings → Pages → Deploy from a branch → **`gh-pages`** / **(root)**.

Live: https://sbkoth.github.io/sbkoth-intro-page/

No paid hosting or database is required for the public site.
