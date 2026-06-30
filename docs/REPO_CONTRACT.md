# Danmercede.info Repo Contract

Date: 2026-06-30

Status: binding repo-local contract.

## Current Name

- `danmercede.info`

## Recommended Name

- `danmercede.info`

## Role

- `web`

## Purpose

`danmercede.info` is a thin public identity-verification and SEO spoke for Dan
Mercede. It renders a structured professional profile, canonical links, and a
checksum-backed static identity page that points back to the `danmercede.com`
hub.

It is not the primary hub and does not own business, platform, runtime,
governance, or infra behavior.

## Owns

- the single-page identity-verification UI in `App.tsx`
- static profile content, version, last-updated metadata, and image metadata in
  `constants.ts`
- client-side checksum display logic in `utils.ts`
- body-bake, SEO, structured data, robots, sitemap, favicons, and Vercel routing

## Does Not Own

- `danmercede.com` hub content or canonical hub decisions
- other personal-brand web surfaces
- product, business, marketing, or platform ownership
- runtime services, backend APIs, shared infra, or governance logic
- secret-bearing build or deploy scope

## Allowed Dependencies

- static React, Vite, TypeScript, Tailwind CDN, Web Crypto, and Vercel hosting
- public links to related personal-brand and affiliated domains
- estate doctrine from `orion-estate-audit`
- the personal-brand family contract and canonical-home registry row

## Forbidden Logic / Forbidden Ownership

- contradicting the canonical hub; hub truth wins on conflict
- expanding this spoke into a primary identity, product, or marketing surface
- adding backend/runtime, platform, shared-infra, or governance ownership
- storing secrets or environment-specific credentials
- weakening profile version/checksum, canonical, sitemap, or structured-data
  behavior

## PR Reject Rules

- reject PRs that make this repo the primary hub or a business/product surface
- reject PRs that override `danmercede.com` identity truth
- reject PRs that add runtime, infra, governance, or secret-scope ownership
- reject PRs that break SEO, body-bake, or identity-verification behavior

## Verification

For docs-only contract changes:

```bash
git diff --check
```

For implementation changes, follow `AGENTS.md`; this repo declares `npm run
build`, `npm test`, `npm run dev`, and `npm run preview` but has no committed
lockfile or lint script. PRs also run the repository CI build-and-bake checks
when GitHub Actions are enabled.

## Basis

- `AGENTS.md`
- `README.md`
- `App.tsx`
- `constants.ts`
- `utils.ts`
- `vite-plugin-bodybake.ts`
- `index.html`
- `repos/repo_contract_registry_20260317.csv` in
  `OrionArchitekton/orion-estate-audit`
- `architecture/repo_contracts/dan_mercede_personal_brand_repo_contract_20260318.md`
  in `OrionArchitekton/orion-estate-audit`
