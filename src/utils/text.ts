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

/**
 * Aramada karşılaştırma için metni sadeleştirir: Türkçe şapkaları ve büyük/küçük
 * farkını kaldırır. Telefonda çoğu kişi şapkasız yazdığı için "sehidiye"
 * yazan "Şehidiye"yi, "carsi" yazan "Çarşı"yı bulabilsin diye gerekli.
 *
 * Eşleme açıkça yazıldı: `String.normalize` Hermes'te her sürümde bulunmuyor
 * ve arama yolunda bir istisna Keşfet ekranını komple düşürürdü.
 */
const ARAMA_KATLAMA: Record<string, string> = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
  â: 'a', Â: 'a',
  î: 'i', Î: 'i',
  û: 'u', Û: 'u',
};

export function foldForSearch(value: string): string {
  let out = '';
  for (const ch of value) {
    out += ARAMA_KATLAMA[ch] ?? ch;
  }
  return out.toLowerCase();
}
