// Nisibis data-integrity validator. Run before every build.
//   node scripts/validate-data.mjs
// Exits non-zero if any route/task references a missing place, or a place is
// missing fields the UI reads. Catches dead references that won't fail typecheck.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(dataDir, f), 'utf8'));

const places = read('places.json');
const routes = read('routes.json');
const tasks = read('tasks.json');

const ids = new Set(places.map((p) => p.id));
const errors = [];

// Referential integrity
for (const r of routes) {
  for (const id of r.poiIds ?? []) {
    if (!ids.has(id)) errors.push(`route "${r.id}" -> missing place "${id}"`);
  }
  if (!r.poiIds || r.poiIds.length === 0) errors.push(`route "${r.id}" has no stops`);
}
for (const t of tasks) {
  if (t.relatedPoiId && !ids.has(t.relatedPoiId)) {
    errors.push(`task "${t.id}" -> missing place "${t.relatedPoiId}"`);
  }
}

// Place shape the UI relies on
const arrays = ['activities', 'tips', 'photoTips', 'safetyNotes', 'sources', 'tags'];
for (const p of places) {
  if (!p.id || !p.name) errors.push(`place missing id/name: ${JSON.stringify(p).slice(0, 60)}`);
  for (const key of arrays) {
    if (!Array.isArray(p[key])) errors.push(`place "${p.id}" -> "${key}" must be an array`);
  }
  const hasCoord =
    (p.latitude != null && p.longitude != null) ||
    (p.approxLatitude != null && p.approxLongitude != null);
  if (!hasCoord) errors.push(`place "${p.id}" has no usable coordinate (verified or approx)`);
}

if (errors.length) {
  console.error(`\u2716 Data validation FAILED (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`\u2713 Data OK: ${places.length} places, ${routes.length} routes, ${tasks.length} tasks. No dead references.`);
