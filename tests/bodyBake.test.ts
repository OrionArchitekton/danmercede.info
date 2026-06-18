// Guard for the build-time body-bake (vite-plugin-bodybake.ts). The bake injects
// crawler-visible <body> content into the built index.html; this is the only
// automated protection against drift between the baked crawler body and the live
// App/PROFILE_DATA (a section dropped, the <main>/skip-link lost, a blank body).
// Run via `npm test` (tsx --test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderBakedBody } from '../vite-plugin-bodybake';
import { PROFILE_DATA } from '../constants';

// Mirror the escape the bake applies to interpolated text.
const esc = (s: string) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const baked = renderBakedBody(PROFILE_DATA);

test('baked body is a non-empty string with >0 <p>', () => {
  assert.equal(typeof baked, 'string');
  assert.ok(baked.length > 0);
  assert.ok((baked.match(/<p[ >]/g) || []).length > 0);
});

test('exactly one <h1> == fullName, and the descriptor', () => {
  assert.equal((baked.match(/<h1[ >]/g) || []).length, 1);
  assert.ok(baked.includes(esc(PROFILE_DATA.fullName)));
  assert.ok(baked.includes(esc(PROFILE_DATA.descriptor)));
});

test('keeps the <main> landmark and skip link', () => {
  assert.match(baked, /<main id="main-content"/);
  assert.match(baked, /href="#main-content"/);
});

test('identity-summary prose uses a grammatical "since <startYear>"', () => {
  const start = PROFILE_DATA.summary.yearsActive.split(/[–—-]/)[0].trim();
  assert.ok(baked.includes(`since ${esc(start)}.`), `expected "since ${start}."`);
  assert.ok(!baked.includes(`since ${esc(PROFILE_DATA.summary.yearsActive)}`), 'must not render "since <range>"');
});

test('every PROFILE_DATA collection App renders is present in the bake', () => {
  for (const l of PROFILE_DATA.links) assert.ok(baked.includes(esc(l.label)), `link ${l.label}`);
  for (const p of PROFILE_DATA.currentPositions) assert.ok(baked.includes(esc(p.company)), `position ${p.company}`);
  for (const p of PROFILE_DATA.platforms) assert.ok(baked.includes(esc(p.name)), `platform ${p.name}`);
  for (const e of PROFILE_DATA.education) assert.ok(baked.includes(esc(e.institution)), `education ${e.institution}`);
  // Timeline was previously omitted — assert every entry's company is now baked.
  for (const t of PROFILE_DATA.timeline) assert.ok(baked.includes(esc(t.company)), `timeline ${t.company}`);
});
