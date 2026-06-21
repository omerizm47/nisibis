// Nisibis Play Store graphics generator.
// Outputs: assets/play/icon-512.png (512x512) and assets/play/feature-graphic.png (1024x500).
//
// Requires `sharp`:  npm i -D sharp  &&  node scripts/generate-store-graphics.mjs

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'assets', 'play');
mkdirSync(outDir, { recursive: true });

function star8(cx, cy, outer, inner) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function emblem(main, accent) {
  return `
    <path d="M18 108 L18 54 Q18 18 60 12 Q102 18 102 54 L102 108" stroke="${main}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="24" y="100" width="72" height="3" rx="1.5" fill="${main}"/>
    <polygon points="30,60 54,60 42,44" fill="${main}"/>
    <rect x="34" y="60" width="16" height="40" fill="${main}"/>
    <rect x="41" y="31" width="2" height="13" rx="1" fill="${accent}"/>
    <rect x="37" y="35" width="10" height="2" rx="1" fill="${accent}"/>
    <polygon points="72,47 80,47 76,33" fill="${main}"/>
    <rect x="72" y="47" width="8" height="53" fill="${main}"/>
    <rect x="68.5" y="65" width="15" height="4" rx="1" fill="${main}"/>
    <circle cx="76" cy="29.5" r="2.6" fill="${accent}"/>
    <polygon points="${star8(60, 27, 8.5, 3.6)}" fill="${accent}"/>
  `;
}

const GRAD = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
  <stop offset="0" stop-color="#D98A3D"/><stop offset="1" stop-color="#A0481A"/>
</linearGradient></defs>`;

function iconSvg(size) {
  const h = size * 0.508;
  const s = h / 112;
  const w = 120 * s;
  const tx = (size - w) / 2;
  const ty = (size - h) / 2;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${GRAD}<rect width="${size}" height="${size}" fill="url(#bg)"/>
    <g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(5)})">${emblem('#FBF3E6', '#F4CE86')}</g>
  </svg>`;
}

function featureSvg() {
  const W = 1024;
  const H = 500;
  const h = 360;
  const s = h / 112;
  const tx = 90;
  const ty = (H - h) / 2;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${GRAD}<rect width="${W}" height="${H}" fill="url(#bg)"/>
    <g transform="translate(${tx},${ty}) scale(${s.toFixed(5)})">${emblem('#FBF3E6', '#F4CE86')}</g>
    <text x="540" y="248" font-family="Georgia, 'Times New Roman', serif" font-size="120" font-weight="700" fill="#FBF3E6">Nisibis</text>
    <text x="544" y="312" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#F4DEB8">Nusaybin Keşif Rehberi</text>
  </svg>`;
}

async function run() {
  await sharp(Buffer.from(iconSvg(512))).png().toFile(join(outDir, 'icon-512.png'));
  await sharp(Buffer.from(featureSvg())).png().toFile(join(outDir, 'feature-graphic.png'));
  console.log('Generated: assets/play/icon-512.png, assets/play/feature-graphic.png');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
