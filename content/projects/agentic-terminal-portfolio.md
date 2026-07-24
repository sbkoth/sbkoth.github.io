---
title: Agentic Terminal Portfolio
slug: agentic-terminal-portfolio
description: Terminal-first personal site modernized and maintained with heavy multi-agent coding—static GitHub Pages, Zod content, and verification gates
publishedAt: 2026-07-24
thumbnail: /uploads/profile-formal.jpg
type: text
technologies:
  - React
  - Vite
  - TypeScript
  - Tailwind CSS
  - Zod
  - Agentic coding
  - GitHub Pages
challenge: >
  Keep a personal portfolio modern and maintainable without a heavy marketing stack,
  while using agentic coding as the primary way to implement, clean up, and verify changes.
approach: >
  Terminal-first UX as the product surface; pure static export for production; data-driven
  command registry; agents handle multi-file cleanup, a11y, tests, and deploys under
  human-directed plans and quality gates.
outcomes:
  - Shipped React 19 + Vite 8 + Tailwind 4 terminal portfolio on pure static GitHub Pages
  - Purged pre-v3 marketing components and unused Radix/shadcn surface from the live import graph
  - Strengthened accessibility (live regions, combobox autocomplete) and data-load error UX
  - Content and code changes driven by agent sessions with check / test / lint / build gates
---

# Agentic Terminal Portfolio

## Overview

This portfolio ([sbkoth.github.io](https://sbkoth.github.io/)) is an interactive terminal—not a multi-section marketing page. It is actively developed with **agentic coding**: multi-step agent sessions that implement plans, delete dead code, expand tests, and only declare done when the quality suite is green.

## Challenge

Personal sites rot when the stack is heavy and the UX is unclear. The goal was a durable, Terminal-first experience that stays pure static in production, while making **agentic software engineering** a visible, honest part of how the site is built and maintained.

## Approach

- **Terminal-first product** — Commands (`about`, `projects`, `features`, `services`, themes, history) from a data-driven registry
- **Static production** — Markdown + Zod-validated export to JSON; no runtime server on GitHub Pages
- **Agent-friendly architecture** — Pure modules for dispatch, autocomplete, sanitize, and export so agents can prove changes with unit tests
- **Verification loops** — `check`, `test`, `lint`, and `build:pages` as the definition of done for agent runs
- **Sanitized dialog path** — `marked` + DOMPurify for any markdown HTML surface

## Implementation highlights

1. Modernized stack: React 19, Vite 8, TypeScript 7, Tailwind 4, Zod 4, Biome
2. Removed unreachable marketing-era components; kept only the terminal path plus content-dialog
3. Accessibility: combobox autocomplete, live regions, welcome + help announcements
4. Performance: optimized uploads, trimmed font weights, history caps for long sessions
5. Content reflects current practice: agentic coding in profile, features, services, and this project

## Technologies

React, Vite, TypeScript, Tailwind CSS, TanStack Query, Zod, marked, isomorphic-dompurify, GitHub Pages, multi-agent coding workflows
