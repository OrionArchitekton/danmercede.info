# danmercede.info

Personal identity and SEO site for Dan Mercede, presenting a verifiable, structured professional profile.

**Live:** https://www.danmercede.info/ · **Canonical hub:** https://danmercede.com

## What this is

A single-page React app that renders one "identity verification" profile for Dan Mercede:
name, descriptor, canonical links, current positions, platform associations, career
timeline, education, and a disambiguation notice. All content is driven by a static data
object (`PROFILE_DATA` in `constants.ts`).

The page computes a SHA-256 checksum of a canonical subset of the profile in the browser
(`utils.ts`, Web Crypto) and shows the first 10 hex characters in the footer as `CHK:`.
It also emits schema.org JSON-LD (`WebSite` / `WebPage`) whose `about` and `publisher`
point at `https://www.danmercede.com/#person`.

This is a live, self-canonical website — a thin SEO spoke that backlinks to the
danmercede.com hub. The hub is the source of truth: if anything here conflicts with the
hub, the hub wins.

## Stack

- React 19 + React DOM 19
- Vite 6, TypeScript 5.8
- `@vitejs/plugin-react`
- Tailwind CSS via CDN (`cdn.tailwindcss.com`), configured inline in `index.html`
- Inter + JetBrains Mono from Google Fonts
- schema.org JSON-LD for structured data
- Web Crypto `SubtleCrypto` for the client-side SHA-256 checksum
- Build-time body-bake: a Vite plugin (`vite-plugin-bodybake.ts`) injects a static,
  crawlable identity profile into `#root` at build time so non-JS answer-engine crawlers
  see real `<body>` content; React replaces it on mount for human visitors (no SSR runtime)
- Hosted on Vercel

## Local development

```bash
npm install
npm run dev      # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

There is no `.env` to configure. `vite.config.ts` contains a leftover `GEMINI_API_KEY`
define block from an AI Studio template; nothing in the source reads it, no key is
committed, and the site runs without it.

## Editing the profile

All identity content is hardcoded in `constants.ts`:

- `PROFILE_DATA` — name, descriptor, links, positions, platforms, timeline, education,
  disambiguation.
- `IMAGE_METADATA` — `alt` / `description` for each headshot in `public/`.
- `LAST_UPDATED` and `VERSION` (`constants.ts:5-6`) — bump these manually when content
  changes. The checksum is derived from a canonical subset of the profile, so it changes whenever any of those included fields (including `version` and `lastUpdated`) are updated.

## Deploy

Deployed on Vercel. `vercel.json` defines:

- An SPA rewrite of `/(.*)` to `/index.html`.
- `Content-Type: application/xml` and `Cache-Control: public, max-age=3600` headers for
  `/sitemap.xml`.

The site is SEO-tuned: `public/robots.txt` (allow `/`, disallow `/admin`, `/api`,
`/preview`, `/draft`, `/_next/`, `/static/`), `public/sitemap.xml`, favicons,
`apple-touch-icon`, `site.webmanifest`, and Open Graph / Twitter meta in `index.html`.
The page also offers a Print / PDF action (`window.print`) with print-specific `@media`
CSS in `index.html`.

## External entities

URLs the profile and app actually reference:

- danmercede.com — https://danmercede.com (canonical hub)
- LinkedIn — https://www.linkedin.com/in/danmercede
- GitHub — https://github.com/OrionArchitekton
- Orion Apex Capital — https://orionapexcapital.com
- Cosmocrat — https://cosmocrat.ai
- Orion Intelligence Agency — https://www.orionintelligenceagency.com/book (footer CTA)

## Project structure

| Path | What it holds |
|------|---------------|
| `index.html` | HTML shell, Tailwind CDN config, fonts, SEO meta, print CSS |
| `index.tsx` | React root (`createRoot` + `StrictMode`) |
| `App.tsx` | The single-page UI |
| `constants.ts` | `PROFILE_DATA` identity content + image metadata |
| `utils.ts` | Client-side SHA-256 checksum |
| `vite-plugin-bodybake.ts` | Build-time crawlable-body injector (no-SSR prerender into `#root`) |
| `types.ts` | `IdentityProfile` type |
| `vite.config.ts` | Build / dev config |
| `vercel.json` | Deploy routing + headers |
| `public/` | robots.txt, sitemap.xml, favicons, webmanifest, headshot images |

## Notes

This repo is private (`package.json` version `0.0.0`) and has no `LICENSE` file, no CI
workflows, no test suite, and no lint config.
