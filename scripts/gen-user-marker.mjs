// One-off: generate the user-location dot marker PNG, matching the size of the
// existing category markers.  node scripts/gen-user-marker.mjs   (requires sharp)
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'images', 'markers');

const m = await sharp(join(dir, 'park.png')).metadata();
const W = m.width;
const H = m.height;
const cx = W / 2;
const cy = H / 2;
const s = Math.min(W, H);
const ring = Math.round(s * 0.30);
const core = Math.round(s * 0.155);
const bw = Math.max(2, Math.round(core * 0.3));

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${ring}" fill="#2E4374" fill-opacity="0.20"/>
  <circle cx="${cx}" cy="${cy}" r="${core}" fill="#2E4374" stroke="#FFFFFF" stroke-width="${bw}"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(dir, 'user.png'));
console.log('generated user.png at', W + 'x' + H);
