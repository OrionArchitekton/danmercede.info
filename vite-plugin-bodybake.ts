import type { Plugin } from 'vite';
import { PROFILE_DATA } from './constants';
import type { IdentityProfile } from './types';

/**
 * Build-time body-bake (W1, MAP 20260617).
 *
 * Non-Google answer engines (ChatGPT/GPTBot, Perplexity, ClaudeBot) fetch raw
 * HTML and do NOT execute JavaScript. An empty `<div id="root"></div>` is
 * invisible to them. This plugin injects a static, crawlable HTML skeleton —
 * derived from the single source of truth (`PROFILE_DATA` in constants.ts) —
 * INTO `#root` at build time.
 *
 * React's `createRoot(...).render(...)` clears `#root` children on mount, so
 * the baked markup is the crawler payload and is replaced by the live app for
 * human visitors (prerender-into-root / progressive-enhancement pattern).
 *
 * This is a no-SSR, browserless, build-time string emission — NOT a framework
 * or SSR-runtime migration.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Exported so tests/bodyBake.test.ts can assert render parity (the baked
// crawler body vs PROFILE_DATA / App.tsx) without invoking the build.
export function renderBakedBody(data: IdentityProfile): string {
  const {
    fullName,
    descriptor,
    location,
    summary,
    links,
    currentPositions,
    platforms,
    timeline,
    education,
    disambiguation,
  } = data;

  const linksList = links
    .map(
      (link) =>
        `<li><a href="${escapeHtml(link.url)}" rel="noopener noreferrer">${escapeHtml(
          link.label,
        )}</a></li>`,
    )
    .join('');

  const positionsList = currentPositions
    .map(
      (pos) =>
        `<li>${escapeHtml(pos.role)} — ${escapeHtml(pos.company)} (${escapeHtml(
          pos.start,
        )}–${escapeHtml(pos.end)})</li>`,
    )
    .join('');

  // Career timeline, mirroring App.tsx (company + date range; role appended
  // unless the catch-all "Various Operational Roles" bucket). Previously omitted
  // from the bake, so the crawler/no-JS body diverged from the live app.
  const timelineList = timeline
    .map((item) => {
      const roleSuffix =
        item.role !== 'Various Operational Roles' ? ` — ${escapeHtml(item.role)}` : '';
      return `<li>${escapeHtml(item.company)} (${escapeHtml(item.start)}–${escapeHtml(
        item.end,
      )})${roleSuffix}</li>`;
    })
    .join('');

  const platformsList = platforms
    .map(
      (plat) =>
        `<li><strong>${escapeHtml(plat.name)}</strong>: ${escapeHtml(
          plat.description,
        )}</li>`,
    )
    .join('');

  const educationList = education
    .map(
      (edu) =>
        `<li>${escapeHtml(edu.degree)}, ${escapeHtml(edu.field)} — ${escapeHtml(
          edu.institution,
        )}${edu.year ? ` (${escapeHtml(edu.year)})` : ''}</li>`,
    )
    .join('');

  // yearsActive is a "2015–Present" range; "since 2015–Present" is ungrammatical,
  // so the prose uses just the start year ("since 2015").
  const activeSince = escapeHtml(summary.yearsActive.split(/[–—-]/)[0].trim());

  // Self-contained, answer-first identity passage for raw-HTML crawlers, wrapped
  // in the same <main id="main-content"> landmark + skip link the live app
  // provides (no-JS / pre-hydration a11y parity).
  return [
    `<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:no-underline">Skip to main content</a>`,
    `<main id="main-content" tabindex="-1">`,
    `<header>`,
    `<h1>${escapeHtml(fullName)}</h1>`,
    `<p>${escapeHtml(descriptor)}</p>`,
    `</header>`,
    `<section>`,
    `<h2>Identity Summary</h2>`,
    `<p>${escapeHtml(fullName)} is a ${escapeHtml(summary.primaryRole)} at ${escapeHtml(
      summary.primaryOrg,
    )}, working in ${escapeHtml(summary.industry)} since ${activeSince}. Based in ${escapeHtml(
      location,
    )}.</p>`,
    `</section>`,
    `<section>`,
    `<h2>Canonical Links</h2>`,
    `<ul>${linksList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Current Positions</h2>`,
    `<ul>${positionsList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Platform Associations</h2>`,
    `<ul>${platformsList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Career Timeline</h2>`,
    `<ul>${timelineList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Education</h2>`,
    `<ul>${educationList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Disambiguation</h2>`,
    `<p>${escapeHtml(disambiguation)}</p>`,
    `</section>`,
    `</main>`,
  ].join('');
}

export function bodyBake(): Plugin {
  return {
    name: 'danmercede-body-bake',
    // Apply only to the production build; the dev server keeps the empty root.
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html: string) {
        const baked = renderBakedBody(PROFILE_DATA);
        // Fail loud (spec AC1) if the rendered body is empty/headingless — prefer
        // a hard build failure over silently shipping a blank crawler body.
        if (!/<h1[ >]/.test(baked) || !/<p[ >]/.test(baked)) {
          throw new Error(
            'body-bake: rendered body is missing an <h1> or <p> — refusing to emit empty crawler content',
          );
        }
        // Use a replacer function so any `$` in `baked` (dynamic profile data)
        // is treated literally, not as a `$&`/`$1`/etc. replacement pattern.
        const replaced = html.replace(
          /<div id="root">\s*<\/div>/,
          () => `<div id="root">${baked}</div>`,
        );
        if (replaced === html) {
          // Fail loud at build time if the root anchor ever changes shape.
          throw new Error(
            'body-bake: could not find `<div id="root"></div>` to inject crawlable body content',
          );
        }
        return replaced;
      },
    },
  };
}
