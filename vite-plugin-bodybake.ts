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

function renderBakedBody(data: IdentityProfile): string {
  const {
    fullName,
    descriptor,
    location,
    summary,
    links,
    currentPositions,
    platforms,
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

  // Self-contained, answer-first identity passage for raw-HTML crawlers.
  return [
    `<header>`,
    `<h1>${escapeHtml(fullName)}</h1>`,
    `<p>${escapeHtml(descriptor)}</p>`,
    `</header>`,
    `<section>`,
    `<h2>Identity Summary</h2>`,
    `<p>${escapeHtml(fullName)} is a ${escapeHtml(summary.primaryRole)} at ${escapeHtml(
      summary.primaryOrg,
    )}, working in ${escapeHtml(summary.industry)} since ${escapeHtml(
      summary.yearsActive,
    )}. Based in ${escapeHtml(location)}.</p>`,
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
    `<h2>Education</h2>`,
    `<ul>${educationList}</ul>`,
    `</section>`,
    `<section>`,
    `<h2>Disambiguation</h2>`,
    `<p>${escapeHtml(disambiguation)}</p>`,
    `</section>`,
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
