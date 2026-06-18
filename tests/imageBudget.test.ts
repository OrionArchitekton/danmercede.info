// Image-weight regression guard. Walks public/ and fails if any raster/vector
// asset exceeds a per-type byte budget — protects against silent re-bloat of the
// shipped image set (the build copies public/ verbatim into dist/). Budgets carry
// headroom over the current largest of each type; tighten as assets are optimized.
// Run via `npm test` (tsx --test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Per-extension budget in bytes (mirrors the hub's imageBudget guard).
const BUDGETS: Record<string, number> = {
  '.jpg': 250 * 1024,
  '.jpeg': 250 * 1024,
  '.png': 2800 * 1024,
  '.webp': 1300 * 1024,
  '.gif': 1000 * 1024,
  '.svg': 5000 * 1024,
  '.ico': 100 * 1024,
};

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

test('every public/ image is within its per-type byte budget', () => {
  const offenders: string[] = [];
  for (const file of walk(PUBLIC_DIR)) {
    const ext = path.extname(file).toLowerCase();
    const budget = BUDGETS[ext];
    if (budget === undefined) continue; // not an image type we budget
    const size = statSync(file).size;
    if (size > budget) {
      offenders.push(`${path.relative(PUBLIC_DIR, file)}: ${(size / 1024) | 0}KB > ${(budget / 1024) | 0}KB`);
    }
  }
  assert.equal(offenders.length, 0, `image budget exceeded:\n  ${offenders.join('\n  ')}`);
});
