/**
 * Yerel ayara duyarlı büyük harf dönüşümü.
 *
 * CSS `text-transform: uppercase` ve varsayılan `toUpperCase()`, Türkçe i/ı
 * kurallarını bilmez ve "Dil" → "DIL", "Gizlilik" → "GIZLILIK" gibi yanlış
 * sonuçlar üretir. Bu yardımcı Türkçe için i→İ ve ı→I dönüşümünü uygular.
 */
export function upperLocale(value: string, language?: string): string {
  const lang = (language ?? 'tr').split('-')[0];
  if (lang === 'tr') {
    return value.replace(/i/g, 'İ').replace(/ı/g, 'I').toUpperCase();
  }
  return value.toUpperCase();
}
