// Spoke-side identity guardrail (round-2 R12 / O7).
//
// The hub-spoke identity rule (settled doctrine, MAP 20260617):
//   - A spoke's structured data MUST reference the hub Person via the bare @id
//     `https://www.danmercede.com/#person` (the backlink that ties this spoke's
//     identity to the single canonical Person node on the hub).
//   - A spoke MUST NOT declare its OWN local Person node — i.e. no JSON-LD object
//     of `"@type": "Person"` (or a "Person" in an @type array) anchored to THIS
//     spoke's domain. A bare @id reference to the hub #person is allowed; a
//     self-defined Person node is the violation (it would compete with the hub
//     for identity authority and fork the entity graph).
//
// This rule was previously enforced HUB-side only. This test adds the SPOKE-side
// guard: it parses every JSON-LD block embedded in the served index.html and
// asserts (a) the hub backlink is present and (b) there is no local Person node.
// Deterministic and self-contained — no network, no build. Run via `npm test`
// (tsx --test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HUB_PERSON_ID = 'https://www.danmercede.com/#person';
const SPOKE_DOMAIN = 'danmercede.info';

const here = dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = resolve(here, '..', 'index.html');
const html = readFileSync(indexHtmlPath, 'utf8');

// Extract every <script type="application/ld+json">…</script> payload from the
// static index.html (this is the structured data raw-HTML crawlers receive,
// since the JSON-LD lives in <head>, not the JS-rendered body).
function extractJsonLdBlocks(source: string): string[] {
  const blocks: string[] = [];
  const re =
    /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

// Flatten a parsed JSON-LD value into its constituent node objects (handles a
// top-level @graph array, a top-level array, and nested object values so a
// Person buried inside `about`/`publisher`/etc. is still inspected).
function collectNodes(value: unknown, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const v of value) collectNodes(v, out);
  } else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    out.push(obj);
    if (Array.isArray(obj['@graph'])) collectNodes(obj['@graph'], out);
    for (const [k, v] of Object.entries(obj)) {
      if (k === '@graph') continue;
      if (v && typeof v === 'object') collectNodes(v, out);
    }
  }
  return out;
}

function typeIncludesPerson(node: Record<string, unknown>): boolean {
  const t = node['@type'];
  if (typeof t === 'string') return t === 'Person';
  if (Array.isArray(t)) return t.some((x) => x === 'Person');
  return false;
}

// A bare @id reference (e.g. { "@id": "…/#person" }) is a pointer, not a node
// declaration. A SELF-DEFINED Person node carries a @type of Person AND defines
// fields beyond a lone @id (name, url, sameAs, …). We treat any @type:Person
// object as a local Person declaration regardless of which domain anchors it —
// the spoke must never type a node as Person at all.
function isLocalPersonNode(node: Record<string, unknown>): boolean {
  return typeIncludesPerson(node);
}

const blocks = extractJsonLdBlocks(html);

test('index.html embeds at least one JSON-LD block', () => {
  assert.ok(blocks.length > 0, 'expected >=1 <script type="application/ld+json"> in index.html');
});

test('every JSON-LD block parses as valid JSON', () => {
  for (const [i, b] of blocks.entries()) {
    assert.doesNotThrow(() => JSON.parse(b), `JSON-LD block #${i} must be valid JSON`);
  }
});

test('structured data references the hub Person backlink (danmercede.com/#person)', () => {
  const refsHub = blocks.some((b) => {
    const nodes = collectNodes(JSON.parse(b));
    return nodes.some((n) => n['@id'] === HUB_PERSON_ID);
  });
  assert.ok(
    refsHub,
    `expected a JSON-LD node referencing the hub Person via "@id": "${HUB_PERSON_ID}"`,
  );
});

test('structured data declares NO local Person node (identity belongs to the hub)', () => {
  const offenders: string[] = [];
  for (const b of blocks) {
    for (const node of collectNodes(JSON.parse(b))) {
      if (isLocalPersonNode(node)) {
        offenders.push(JSON.stringify(node));
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `spoke must not declare its own Person node (identity is the hub's); found: ${offenders.join(' | ')}`,
  );
});

// NEGATIVE / self-check: prove the guard above actually FIRES on a regression.
// We synthesize the exact violation the guard defends against — a competing
// local Person node anchored to this spoke's own domain, injected into the
// page's @graph — and assert the detector flags it. This makes the guard's
// failure mode executable, not merely asserted in a comment.
test('NEGATIVE: guard detects an injected competing local Person node', () => {
  const baseBlock = blocks[0];
  const parsed = JSON.parse(baseBlock) as Record<string, unknown>;
  const graph = Array.isArray(parsed['@graph']) ? (parsed['@graph'] as unknown[]) : [parsed];
  const poisoned = {
    '@context': 'https://schema.org',
    '@graph': [
      ...graph,
      {
        '@type': 'Person',
        '@id': `https://www.${SPOKE_DOMAIN}/#person`,
        name: 'Dan Mercede',
        url: `https://www.${SPOKE_DOMAIN}/`,
      },
    ],
  };
  const offenders = collectNodes(poisoned).filter(isLocalPersonNode);
  assert.equal(
    offenders.length,
    1,
    'the guard must detect a competing local Person node when one is present',
  );
  // And the real index.html must NOT contain that violation (sanity: the
  // positive test above already asserts this, restated here against the same
  // detector the negative case exercises).
  const liveOffenders = blocks.flatMap((b) => collectNodes(JSON.parse(b)).filter(isLocalPersonNode));
  assert.equal(liveOffenders.length, 0, 'live index.html must carry zero local Person nodes');
});
