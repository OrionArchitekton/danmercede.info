# AGENTS.md — danmercede-info

## Repo Role

`danmercede-info` is the public identity-verification web surface for
danmercede.info: a minimal React 19 + Vite + TypeScript SPA, deployed on
Vercel, rendering one structured identity profile for Dan Mercede from static
data in `constants.ts`. It is a thin SEO spoke that backlinks to the
danmercede.com hub — not the primary website.

## Repo Identity

- **Repo name:** `OrionArchitekton/danmercede.info` (GitHub)
- **Local home:** `personal-brand/dan-mercede/danmercede-info/`
- **Registry row:** `personal-brand-dan-mercede-danmercede-info` in
  `orion-estate-audit/estate_home_registry.yaml` — in the orion-estate-audit
  repo (sibling estate repo, not in this checkout)
- **Deploy target:** Vercel (`vercel.json`: SPA rewrite + sitemap headers)
- **Conflict rule:** https://danmercede.com is the canonical hub; if anything
  here conflicts with the hub, the hub wins.

## Boundaries

Owns:

- the danmercede.info page UI (`App.tsx`, `components/SchemaMarkup.tsx`)
- identity profile content and image metadata (`constants.ts`), including
  manual `LAST_UPDATED` / `VERSION` bumps and the client-side checksum
  (`utils.ts`)
- SEO surface: `index.html` meta, `public/robots.txt`, `public/sitemap.xml`

Does not own:

- danmercede.com hub content or any other personal-brand surface
- shared platform, runtime, or governance code — none lives here

## Start Here

- [README.md](README.md) — stack, local dev, deploy, project structure
- [constants.ts](constants.ts) — `PROFILE_DATA`: all identity content
- [App.tsx](App.tsx) — single-page UI
- [vercel.json](vercel.json) — deploy routing + headers

## Validation

No test or lint commands are declared — `package.json` has only `dev`,
`build`, and `preview` scripts, and there is no CI workflow, test suite, or
lint config.

Declared by `package.json` — not verified in this change (no committed
lockfile to install from):

```bash
npm run build
```

## Estate Authority

See `orion-estate-audit/AGENTS.md` — in the orion-estate-audit repo (sibling
estate repo, not in this checkout) — for cross-repo doctrine. This repo is a
personal-brand surface under `personal-brand/dan-mercede/`; its canonical home
is tracked in `orion-estate-audit/estate_home_registry.yaml` (row
`personal-brand-dan-mercede-danmercede-info`, same sibling repo) and the
`dan_mercede_personal_brand_repo_contract_20260318.md` repo contract (under
`architecture/repo_contracts/` in that repo).
