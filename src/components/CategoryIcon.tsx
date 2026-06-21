import { type ComponentProps } from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import type { PlaceCategory } from '@/types';

function star8(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

interface CategoryIconProps {
  category: PlaceCategory;
  size?: number;
  color: string;
  style?: ComponentProps<typeof Svg>['style'];
}

/**
 * Nusaybin'e özgü, elle çizilmiş kategori ikonları (özel SVG).
 * Her glif bir kültürel temaya dayanır: antik sütun, kemer+yıldız,
 * terazi, manzara, çay bardağı, servi ağacı, kilim madalyonu.
 */
export function CategoryIcon({ category, size = 16, color, style }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {glyph(category, color)}
    </Svg>
  );
}

function glyph(category: PlaceCategory, c: string) {
  switch (category) {
    case 'tarihi':
      // Antik yivli sütun (sütun başlığı + 3 yiv + kaide)
      return (
        <>
          <Rect x={4} y={3.6} width={16} height={2.6} rx={0.8} fill={c} />
          <Rect x={6.8} y={6.8} width={2.4} height={10.6} fill={c} />
          <Rect x={10.8} y={6.8} width={2.4} height={10.6} fill={c} />
          <Rect x={14.8} y={6.8} width={2.4} height={10.6} fill={c} />
          <Rect x={4} y={18} width={16} height={2.6} rx={0.8} fill={c} />
        </>
      );
    case 'inanc-kultur':
      // Yan yana kilise (haçlı çatı) ve cami (kubbe + alem) — bir arada yaşam
      return (
        <>
          <Polygon points="2.6,12.5 9.4,12.5 6,7.6" fill={c} />
          <Rect x={3.1} y={12.5} width={5.8} height={8.4} fill={c} />
          <Rect x={5.4} y={2.8} width={1.3} height={4} fill={c} />
          <Rect x={4.1} y={4} width={3.9} height={1.3} fill={c} />
          <Path d="M13.1 13.2 Q13.1 7.4 17 7.4 Q20.9 7.4 20.9 13.2 Z" fill={c} />
          <Rect x={13.1} y={13.2} width={7.8} height={7.7} fill={c} />
          <Circle cx={17} cy={5.6} r={1.25} fill={c} />
          <Rect x={2.2} y={20.9} width={19.6} height={1.5} rx={0.5} fill={c} />
        </>
      );
    case 'carsi':
      // Çarşı terazisi (alışveriş / esnaf kültürü)
      return (
        <>
          <Circle cx={12} cy={3.4} r={1.4} fill={c} />
          <Rect x={11.2} y={4.6} width={1.6} height={13.6} fill={c} />
          <Rect x={7.5} y={18.4} width={9} height={2} rx={0.7} fill={c} />
          <Rect x={4} y={6.3} width={16} height={1.5} rx={0.7} fill={c} />
          <Path d="M3.6 8.2 L8.8 8.2 L7.6 11.4 Q6.2 12.5 4.8 11.4 Z" fill={c} />
          <Path d="M15.2 8.2 L20.4 8.2 L19.2 11.4 Q17.8 12.5 16.4 11.4 Z" fill={c} />
        </>
      );
    case 'fotograf':
      // Çerçeveli manzara (fotoğraf noktası) — güneş + dağlar
      return (
        <>
          <Rect x={3.4} y={5} width={17.2} height={14} rx={2.2} stroke={c} strokeWidth={2} fill="none" />
          <Circle cx={8} cy={9.6} r={1.9} fill={c} />
          <Path d="M4.6 16.6 L9.8 11 L13.2 14.6 L16 11.6 L19.4 16.6 Z" fill={c} />
        </>
      );
    case 'yemek-icecek':
      // Türk çay bardağı (lale biçimli) + tabak + buhar
      return (
        <>
          <Path d="M10 2.6 Q9 3.8 10 5" stroke={c} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <Path d="M14 2.6 Q13 3.8 14 5" stroke={c} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <Path
            d="M8.8 7 L15.2 7 Q13.8 10.4 13.2 13 Q12.7 15.4 12 15.9 Q11.3 15.4 10.8 13 Q10.2 10.4 8.8 7 Z"
            fill={c}
          />
          <Rect x={6.8} y={17.4} width={10.4} height={2} rx={1} fill={c} />
        </>
      );
    case 'park':
      // Yapraklı park ağacı
      return (
        <>
          <Circle cx={8.9} cy={10.2} r={3.7} fill={c} />
          <Circle cx={15.1} cy={10.2} r={3.7} fill={c} />
          <Circle cx={12} cy={7} r={4.3} fill={c} />
          <Circle cx={12} cy={11.6} r={4.1} fill={c} />
          <Rect x={10.85} y={13.4} width={2.3} height={7.2} rx={0.6} fill={c} />
          <Path d="M5.5 20.6 Q12 18.9 18.5 20.6 L18.5 21.5 L5.5 21.5 Z" fill={c} />
        </>
      );
    case 'yerel-deneyim':
      // Kilim madalyonu (yerel el sanatı / deneyim)
      return (
        <>
          <Polygon
            points="12,2.4 21.6,12 12,21.6 2.4,12"
            stroke={c}
            strokeWidth={1.9}
            fill="none"
            strokeLinejoin="round"
          />
          <Polygon points="12,7.4 16.6,12 12,16.6 7.4,12" fill={c} />
          <Polygon points="12,1 13.4,2.4 12,3.8 10.6,2.4" fill={c} />
          <Polygon points="12,20.2 13.4,21.6 12,23 10.6,21.6" fill={c} />
        </>
      );
    default:
      return <Polygon points={star8(12, 12, 7, 3)} fill={c} />;
  }
}
