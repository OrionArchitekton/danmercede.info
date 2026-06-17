# Spec: Build-time body-bake for danmercede.info

**Feature:** Crawler-visible `<body>` content baked at build time (W1, MAP 20260617).
**Repo:** `OrionArchitekton/danmercede.info` (thin SEO spoke).
**Approach:** No-SSR, browserless, build-time HTML emission. NOT a framework/SSR migration.

## Problem

The served `<body>` is an empty `<div id="root"></div>`. Non-Google answer engines
(ChatGPT/GPTBot, Perplexity, ClaudeBot) fetch raw HTML and do NOT execute JavaScript,
so they see zero body content — invisible to exactly the answer engines the spoke
targets. The head carries title/desc/OG/Twitter/JSON-LD; the body carries nothing.

## Approach

A Vite build-time plugin (`vite-plugin-bodybake.ts`) reads the static `PROFILE_DATA`
from `constants.ts` (the single source of truth) and, via `transformIndexHtml`, injects
a static, crawlable HTML skeleton INTO `<div id="root">` in the emitted `dist/index.html`.

- Build-time string emission only — no headless browser, no React render, no SSR runtime.
- React's `createRoot(...).render(...)` clears `#root` children on mount, so the baked
  markup is the crawler payload and is replaced by the live React app for human visitors
  (progressive-enhancement / prerender-into-root pattern).
- Content is derived from `PROFILE_DATA`, so the baked body cannot drift from the source
  of truth (single-source guarantee).

## Scenarios

1. **Raw-HTML crawler (no JS):** GETs `/`, sees a real `<h1>Dan Mercede</h1>`, the
   descriptor, the identity-summary paragraph, canonical links, positions, platforms,
   and the disambiguation paragraph as actual text in `<body>` — not an empty root div.
2. **Human visitor (JS on):** React mounts over `#root`; the live app is byte-identical
   in behavior to before this change (the baked content is transient pre-hydration markup).
3. **Single source of truth:** Changing `PROFILE_DATA.fullName` / `descriptor` /
   `summary` / `disambiguation` changes the baked body on the next build — no second
   copy to maintain.

## Acceptance criteria

- AC1: Built `dist/index.html` contains exactly one `<h1>` inside `<body>` with the
  profile full name, and `> 0` `<p>` elements with real profile text.
- AC2: The baked content lives inside `<div id="root">…</div>` (so React replaces it on
  mount; no duplicate visible content for human visitors).
- AC3: No headless browser, no SSR runtime, no framework migration is introduced;
  the only build step remains `vite build`.
- AC4: The baked copy is derived from `PROFILE_DATA` in `constants.ts` (no hardcoded
  second source of identity text).
- AC5: `npm run build` succeeds; the served head (title/desc/OG/Twitter/JSON-LD) is
  unchanged by the body-bake step.

## Deploy topology (why source suffices)

`dist/` is gitignored; no build artifact is committed. Vercel runs `vite build` on
deploy (default Vite `outputDirectory: dist`), so a source change to `index.html` /
`constants.ts` / `vite.config.ts` is the deploy truth — the body-bake goes live on the
next deploy with no committed-bundle regeneration step. (Contrast: the danmercede.com
hub commits `build/` and needs a separate bundle-regen.)

## Non-goals

- No SSR / SSG framework migration (explicitly out per MAP gate decision 1).
- No per-route meta (this spoke is a single route; no router exists).
