// Nisibis launch assets generator.
// Builds the app icon, Android adaptive foreground, and splash logo from the
// brand "Emblem" (church + mosque + 8-pointed star + Mardin arch).
//
// Requires the `sharp` package (SVG -> PNG):
//   npm i -D sharp
//   node scripts/generate-launch-assets.mjs
//
// Outputs: assets/icon.png, assets/adaptive-icon.png, assets/splash.png

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

/** Eight-pointed star points (cultural motif), matching src/components/Emblem.tsx. */
function star8(cx, cy, outer, inner) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

/** Emblem markup in its native 120x112 viewBox. */
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

const SIZE = 1024;

/** Centered emblem group: scale so the emblem is `targetH` px tall. */
function emblemGroup(targetH, main, accent) {
  const s = targetH / 112;
  const w = 120 * s;
  const tx = (SIZE - w) / 2;
  const ty = (SIZE - targetH) / 2;
  return `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(5)})">${emblem(main, accent)}</g>`;
}

function svgDoc(inner) {
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

// App icon: warm gold->terracotta gradient ground, cream emblem with gold accents.
const iconSvg = svgDoc(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D98A3D"/>
      <stop offset="1" stop-color="#A0481A"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  ${emblemGroup(520, '#FBF3E6', '#F4CE86')}
`);

// Adaptive foreground: transparent, emblem kept inside the safe zone.
const adaptiveSvg = svgDoc(emblemGroup(430, '#FBF3E6', '#F4CE86'));

// Splash logo: transparent, terracotta emblem (shown over cream background).
const splashSvg = svgDoc(emblemGroup(460, '#B0532A', '#A8632A'));

async function run() {
  await sharp(Buffer.from(iconSvg)).flatten({ background: '#A0481A' }).png().toFile(join(assetsDir, 'icon.png'));
  await sharp(Buffer.from(adaptiveSvg)).png().toFile(join(assetsDir, 'adaptive-icon.png'));
  await sharp(Buffer.from(splashSvg)).png().toFile(join(assetsDir, 'splash.png'));
  console.log('Generated: assets/icon.png, assets/adaptive-icon.png, assets/splash.png');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
