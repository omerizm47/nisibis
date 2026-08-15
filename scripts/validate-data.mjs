// Nisibis data-integrity validator. Run before every build.
//   node scripts/validate-data.mjs
// Exits non-zero if any route/task references a missing place, a place is missing
// fields the UI reads, or a place has no bundled image. Runs for every city.

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'src', 'data');

const CITIES = ['nusaybin', 'mardin'];
const errors = [];
const summary = [];

for (const city of CITIES) {
  const cityDir = join(dataDir, city);
  const read = (f) => JSON.parse(readFileSync(join(cityDir, f), 'utf8'));
  const places = read('places.json');
  const routes = read('routes.json');
  const tasks = read('tasks.json');
  const imagesSrc = readFileSync(join(cityDir, 'images.ts'), 'utf8');

  const ids = new Set(places.map((p) => p.id));
  const fail = (msg) => errors.push(`[${city}] ${msg}`);
  let images = 0;

  // Referential integrity
  for (const r of routes) {
    for (const id of r.poiIds ?? []) {
      if (!ids.has(id)) fail(`route "${r.id}" -> missing place "${id}"`);
    }
    if (!r.poiIds || r.poiIds.length === 0) fail(`route "${r.id}" has no stops`);
  }
  for (const t of tasks) {
    if (t.relatedPoiId && !ids.has(t.relatedPoiId)) {
      fail(`task "${t.id}" -> missing place "${t.relatedPoiId}"`);
    }
  }

  // Place shape the UI relies on
  const arrays = ['activities', 'tips', 'photoTips', 'safetyNotes', 'sources', 'tags'];
  for (const p of places) {
    if (!p.id || !p.name) fail(`place missing id/name: ${JSON.stringify(p).slice(0, 60)}`);
    for (const key of arrays) {
      if (!Array.isArray(p[key])) fail(`place "${p.id}" -> "${key}" must be an array`);
    }
    const hasCoord =
      (p.latitude != null && p.longitude != null) ||
      (p.approxLatitude != null && p.approxLongitude != null);
    if (!hasCoord) fail(`place "${p.id}" has no usable coordinate (verified or approx)`);

    // Her mekanin en az bir paketlenmis gorseli olmali ve dosyalar diskte bulunmali.
    const block = imagesSrc.match(
      new RegExp(`['"]?${p.id}['"]?\\s*:\\s*\\[([\\s\\S]*?)\\]`),
    );
    if (!block) {
      fail(`place "${p.id}" has no entry in ${city}/images.ts`);
    } else {
      const files = [...block[1].matchAll(/require\('([^']+)'\)/g)].map((m) => m[1]);
      if (files.length === 0) fail(`place "${p.id}" -> images.ts entry is empty`);
      for (const f of files) {
        if (!existsSync(join(cityDir, f))) {
          fail(`place "${p.id}" -> bundled image not found: ${f}`);
        }
      }
      // Galeri kunyeleri gorsel sayisiyla birebir olmali, yoksa yanlis atif cikar.
      const expected = 1 + (p.gallery?.length ?? 0);
      if (files.length !== expected) {
        fail(
          `place "${p.id}" -> ${files.length} bundled image(s) but ${expected} credit record(s) ` +
            `(image + gallery). Bunlar esit olmali.`,
        );
      }
      for (const g of p.gallery ?? []) {
        if (!g.credit || !g.license || !g.sourceUrl) {
          fail(`place "${p.id}" -> a gallery entry is missing credit/license/sourceUrl`);
        }
      }
      images += files.length;
    }
  }

  summary.push(
    `${city}: ${places.length} places, ${routes.length} routes, ${tasks.length} tasks, ` +
      `${images} images`,
  );
}

if (errors.length) {
  console.error(`\u2716 Data validation FAILED (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('\u2713 Data OK. No dead references, every place has a bundled image.');
for (const line of summary) console.log('  ' + line);
