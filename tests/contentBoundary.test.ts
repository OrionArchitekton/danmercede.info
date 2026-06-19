// Content-boundary guard (round-2 R10).
//
// danmercede.info is an IDENTITY-ONLY surface (per AGENTS.md): "the public
// identity-verification web surface ... rendering one structured identity
// profile". It MUST NOT carry promotional / booking / CTA copy — that belongs to
// the hub and the product surfaces, never to an identity-verification page.
//
// This guards the regression class where promotional/marketing copy leaks into
// the identity content (e.g. a "Book a call" CTA, a "Get started" button, a
// product readiness-scan pitch) and silently ships in the baked crawler body —
// the answer-engine-visible payload. It is the spoke-local analogue of the
// danielmercede-info `vite.config.ts` identity-only guard, lifted into a
// build-free unit test over `renderBakedBody(PROFILE_DATA)`.
//
// Deterministic and self-contained — no network, no build. Run via `npm test`
// (tsx --test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderBakedBody } from '../vite-plugin-bodybake';
import { PROFILE_DATA } from '../constants';

// Forbidden promotional / CTA needles. Generalized from the danielmercede-info
// identity-only guard (`orionintelligenceagency`, `readiness scan`, `book a`,
// `/book`) PLUS generic CTA verbs that would signal promotional leakage into an
// identity page. The CTA-verb needles are the load-bearing ones.
//
// Note on `orionintelligenceagency`: PROFILE_DATA legitimately references "Orion
// Intelligence Agency" (spaced) as identity context — a current position and a
// platform association. The needle is the SPACELESS slug/URL form
// `orionintelligenceagency`, which would only appear as a promotional product
// link, never in the spaced identity prose. So forbidding the slug form does NOT
// collide with legitimate identity copy (verified: the spaced name is present in
// the bake, the spaceless slug is not).
const FORBIDDEN: readonly string[] = [
  'book a',
  '/book',
  'readiness scan',
  'buy now',
  'sign up',
  'get started',
  'schedule a call',
  'contact us',
  'hire me',
  'book a call',
  'request a demo',
  'subscribe',
  'orionintelligenceagency',
];

// The detection function under test. Returns every forbidden needle found in the
// (already-lowercased) text. Exported as a local helper so the negative control
// exercises the SAME code path the positive assertion uses — the guard cannot
// degrade to a no-op without the negative control failing.
function findForbidden(lowerText: string): string[] {
  return FORBIDDEN.filter((needle) => lowerText.includes(needle));
}

const baked = renderBakedBody(PROFILE_DATA).toLowerCase();

test('baked identity body carries NO promotional / CTA copy', () => {
  const leaked = findForbidden(baked);
  assert.deepEqual(
    leaked,
    [],
    `identity-only content boundary tripped — baked markup contains promotional/CTA copy: ${leaked.join(
      ', ',
    )}`,
  );
});

// Sanity: the legitimate, spaced identity reference to "Orion Intelligence
// Agency" IS present (it is identity context, not promotion). This documents
// that the guard forbids the promotional slug form, not the identity name, and
// would catch a future drift where the spaced name disappeared from the bake.
test('legitimate spaced identity reference is preserved (not the forbidden slug)', () => {
  assert.ok(
    baked.includes('orion intelligence agency'),
    'expected the spaced identity name "Orion Intelligence Agency" in the baked body',
  );
  assert.ok(
    !baked.includes('orionintelligenceagency'),
    'the spaceless promotional slug must not appear in identity content',
  );
});

// NEGATIVE CONTROL: prove the detector actually FIRES. We synthesize a string
// containing one forbidden needle and assert findForbidden flags it. This runs
// against synthetic fixtures only — it never touches the real baked body — so the
// guard cannot silently degrade into an always-passing no-op (e.g. an empty
// FORBIDDEN list, or a broken includes check).
test('NEGATIVE: detector flags a synthetic string carrying a forbidden needle', () => {
  const poisoned = `${baked} <a href="/book">book a call</a> <button>get started</button>`;
  const flagged = findForbidden(poisoned);
  assert.ok(
    flagged.length > 0,
    'detector failed to flag promotional copy in a synthetic poisoned string — the guard is inert',
  );
  // The specific injected needles must be among those flagged.
  assert.ok(flagged.includes('book a call'), 'expected "book a call" to be flagged');
  assert.ok(flagged.includes('/book'), 'expected "/book" to be flagged');
  assert.ok(flagged.includes('get started'), 'expected "get started" to be flagged');

  // And a clean identity-only string must NOT be flagged (no false positives
  // against the real baked body, restated against the same detector).
  assert.deepEqual(
    findForbidden(baked),
    [],
    'detector wrongly flagged the clean identity-only baked body',
  );
});
