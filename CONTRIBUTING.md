# Contributing

Thanks for improving this terminal portfolio. Keep the **Terminal-first** UX and **static GitHub Pages** deploy model intact.

## Development workflow

1. Install: `npm install` (Node ≥ 20)
2. Run: `npm run dev` (exports content, then Express + Vite on port 5000)
3. Before PR: `npm run check && npm test && npm run lint && npm run build:pages`

## Content

| Path | Purpose |
|------|---------|
| `content/profile.json` | Profile + socials |
| `content/projects/*.md` | Projects (frontmatter + body) |
| `content/features/*.md` | Expertise areas |
| `content/services/*.md` | Services |
| `uploads/` | Static assets served as `/uploads/...` |

Export (`scripts/export-content.ts`) validates with Zod (`shared/schema.ts`) and writes `client/public/data/*.json`.

### Project frontmatter example

```md
---
title: Example project
slug: example-project
description: One-line summary
thumbnail: /uploads/placeholder.jpg
type: text
publishedAt: 2024-01-15
technologies:
  - Kafka
  - Kubernetes
---

Long-form markdown body…
```

`type` must be one of: `image` | `pdf` | `slides` | `text`.

## Adding a terminal command

1. Add a definition to `COMMAND_REGISTRY` in `client/src/terminal/commands.ts` with `cmd`, `desc`, and `handler`.
2. Help and `COMMAND_NAMES` (autocomplete) update automatically.
3. Add/extend tests in `client/src/terminal/commands.test.ts`.

Handlers return `DispatchResult` (`lines`, optional `sideEffect` discriminated union: `clear` | `theme` | `mailto` | `open`).

## Markdown safety

Any HTML shown via `dangerouslySetInnerHTML` must go through `renderSafeMarkdown` in `client/src/lib/sanitize-markdown.ts` (marked + isomorphic-dompurify). Do not bypass this helper.

## Stack notes

- **Tailwind 4**: tokens in `client/src/index.css` (`@theme` + CSS variables for JS-driven themes).
- **Themes**: `client/src/terminal/themes.ts` sets `--term-*` and HSL design tokens on `:root`.
- **Lint/format**: Biome (`npm run lint` / `npm run format`).
- Prefer pure modules for logic so `tsx --test` can drive them without a browser.

## What not to do

- Do not require a production database or CMS.
- Do not replace the terminal with a pure marketing GUI as the primary home experience.
- Do not set `VITE_BASE` away from `/` for this user GitHub Pages site.
