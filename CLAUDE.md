# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Karmator is a simple list randomizer web app built with React + TypeScript + Vite, hosted on GitHub Pages.

## Commands

```bash
npm run dev      # Start dev server at localhost:5173
npm run build    # TypeScript check + production build to dist/
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Deployment

The site auto-deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The base URL is `/karmator/`.

To deploy: push to `main` branch, then enable GitHub Pages (Settings > Pages > Source: GitHub Actions).

## Architecture

Single-page React app with one main component:
- `src/App.tsx` - List input, shuffle logic (Fisher-Yates), and result display
- `src/App.css` - Component styles with light/dark mode support
- `src/index.css` - Base styles and CSS variables
