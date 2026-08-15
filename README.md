# Nisibis — Mardin ve Nusaybin Keşif Rehberi

Mardin'i ve Nusaybin'i keşfetmek için **ücretsiz**, modern ve oyunlaştırılmış bir mobil şehir rehberi.
Android ve iOS'ta çalışan bir **Expo / React Native** uygulamasıdır. Ana ekran, görev odaklı
bir **haritadır**: canlı konumunu görür, önemli durakları işaretçi olarak keşfeder,
"Buraya git" / "Tamamlandı" diyebilir ve seçili şehrin turundaki ilerlemeni yüzde olarak takip edersin.

**İki şehir tek uygulamada.** İstediğin an haritadaki şehir rozetinden ya da Ayarlar > Şehir
bölümünden geçiş yaparsın. Her şehrin kendi durakları, rotaları, görevleri, hikâyesi ve
**ayrı tur yüzdesi** vardır; şehir değiştirmek ilerlemeni silmez.

> MVP tamamen **çevrimdışı veriyle** çalışır (yerel JSON). Backend yoktur; ilerleme cihazda
> `AsyncStorage` ile şehir başına saklanır. Yapı; ileride backend, admin panel ve gerçek harita
> verisi eklenebilecek şekilde modülerdir.

---

## ✨ Özellikler

- **İki şehir**: Mardin (Artuklu eski şehir + yakın çevre) ve Nusaybin. Aralarında tek dokunuşla geçiş.
- **Oyunlaştırılmış harita** (react-native-maps + ücretsiz, API anahtarsız OSM döşemeleri).
- **Canlı konum** (expo-location) — izin reddedilse de uygulama çalışır.
- **Keşfet**: kategori filtreleri + arama. Filtreler yalnızca o şehirde var olan kategorileri gösterir.
- **Yer detayları**: tarihçe, aktiviteler, tavsiyeler, fotoğraf önerileri, ziyaret notları, kaynaklar.
- **Hazır rotalar** ve durak ilerlemesi.
- **Görev sistemi** + AsyncStorage ile kalıcı, şehir başına ilerleme.
- **Çapraz şehir önerisi**: bir şehirde yol alırken ya da turu bitirirken diğer şehri önerir.
- **i18n**: `tr`, `en` ve `ar`. Üç dosya da aynı anahtar kümesine sahiptir.
- **Premium, yöreye uygun tasarım**: altın vurgu, taş‑toprak tonları, Fraunces (serif) + Inter (sans)
  tipografi, dokunsal geri bildirim, şehir başına özel amblem.

---

## 🧩 Teknolojiler

- Expo SDK 53, React Native 0.79, TypeScript
- expo-router (dosya tabanlı navigasyon)
- react-native-maps, expo-location
- @react-native-async-storage/async-storage
- @gorhom/bottom-sheet, react-native-reanimated, react-native-gesture-handler
- i18next + react-i18next + expo-localization
- @expo/vector-icons, expo-linear-gradient, expo-haptics, react-native-svg
- @expo-google-fonts/fraunces, @expo-google-fonts/inter

---

## 🚀 Kurulum

Gereksinimler: **Node.js 18+**, **npm** ve (öneri) **Expo Dev Client**. Haritanın tam
çalışması için **Expo Go yerine bir geliştirme derlemesi (dev build)** gerekir.

```bash
# Bağımlılıkları yükle
npm install

# Expo paket sürümlerini SDK ile hizala (önerilir)
npx expo install --fix

# Sağlık kontrolü
npx expo-doctor
```

## ▶️ Çalıştırma

```bash
# Geliştirme sunucusunu başlat
npm run start

# Tip kontrolü
npm run typecheck

# Lint
npm run lint
```

### Android testi

```bash
# Geliştirme derlemesi oluşturup cihaza/emülatöre kur
npx expo run:android
```

- Android emülatörü (Android Studio) açık olmalı veya bir cihaz USB ile bağlı/hata ayıklama açık olmalı.
- İlk açılışta konum izni nazikçe istenir; reddedilse de harita çalışır.

### iOS testi (yalnızca macOS)

```bash
npx expo run:ios
```

- Xcode ve iOS Simulator kurulu olmalı. İlk derlemede `cd ios && pod install` gerekebilir.

> **Not (Harita):** Uygulama, koyu görünüm için **CARTO dark** (OpenStreetMap verisi) döşemelerini
> `UrlTile` ile kullanır; API anahtarı gerekmez. Android'de varsayılan harita sağlayıcısının taban
> katmanı bazı yapılandırmalarda anahtarsızken sınırlı olabilir; OSM döşeme katmanı üstte çizilir.
> Tamamen sağlayıcıdan bağımsız bir çözüm istenirse MapLibre'ye geçiş için yapı uygundur.

---

## 🗂️ Proje yapısı

```
app/
  _layout.tsx              # Kök: fontlar, i18n, sağlayıcılar (CityProvider dahil), Stack
  (tabs)/
    _layout.tsx            # Sekmeler + onboarding kapısı
    index.tsx              # Harita ekranı (ana) + şehir rozeti
    explore.tsx            # Keşfet
    routes.tsx             # Rotalar
    checklist.tsx          # Görevler
    settings.tsx           # Ayarlar (şehir ve dil seçimi)
  place/[id].tsx           # Yer detay
  route/[id].tsx           # Rota detay
  onboarding.tsx           # Karşılama + şehir seçimi
  privacy.tsx              # Gizlilik
  story.tsx                # Aktif şehrin hikâyesi
src/
  components/              # PlaceCard, RouteCard, CityChip, CityInviteCard, Emblem, ...
  data/
    cities.ts              # Şehir kayıt defteri (veri, harita bölgesi, kaynaklar, amblem)
    activeCity.ts          # Aktüel şehrin modül düzeyindeki işaretçisi
    placeImages.ts         # Aktif şehrin görselini çözer
    nusaybin/              # places.json, routes.json, tasks.json, images.ts
    mardin/                # places.json, routes.json, tasks.json, images.ts
  hooks/                   # useCity, useLocation, usePlaces, useRoutes, useTasks, useProgress, ...
  storage/                 # taskStorage.ts (AsyncStorage, şehir başına anahtar + göç)
  types/                   # place.ts, route.ts, task.ts, category.ts, city.ts
  theme/                   # colors, spacing, typography, categories
  i18n/                    # tr.json, en.json, ar.json, index.ts
  utils/                   # distance, map, constants, color, icons
assets/images/places/
  nusaybin/                # paketlenmiş mekan görselleri
  mardin/
docs/research/             # nusaybin-tourism-research.md
```

---

## ➕ Yeni şehir nasıl eklenir

1. `src/data/<sehir>/` altında `places.json`, `routes.json`, `tasks.json` ve `images.ts` oluştur.
2. Görselleri `assets/images/places/<sehir>/` altına indir ve `images.ts` içinde `require` ile eşle.
3. `src/types/city.ts` içindeki `CityId` birleşimine yeni kimliği ekle.
4. `src/data/cities.ts` içine kaydı ekle: ad, antik ad, harita bölgesi, kaynaklar, `signatureLink`, amblem.
5. `src/i18n/*.json` içinde `story.<sehir>` bloğunu üç dilde de doldur (`blocks` ve `timeline` dahil).
6. `scripts/validate-data.mjs` içindeki `CITIES` dizisine ekle ve çalıştır.

## ➕ Yeni mekan nasıl eklenir

İlgili şehrin `src/data/<sehir>/places.json` dosyasına yeni bir nesne ekle (alanlar `src/types/place.ts`
ile uyumlu olmalı). Her mekanın `images.ts` içinde bir kaydı olmalıdır, yoksa doğrulayıcı hata verir:

```jsonc
{
  "id": "ornek-yer",
  "name": "Örnek Yer",
  "slug": "ornek-yer",
  "category": "tarihi",                // tarihi | inanc-kultur | carsi | fotograf | yemek-icecek | park | yerel-deneyim
  "shortDescription": "Kısa açıklama.",
  "longDescription": "",
  "history": "",
  "activities": [],
  "tips": [],
  "photoTips": [],
  "safetyNotes": [],                    // nazik "Ziyaret Notları" (güvenlik içeriği değil)
  "image": "https://…",                 // ana görselin Commons adresi
  "imageCredit": "Fotoğrafçı, Wikimedia Commons",
  "imageLicense": "CC BY-SA 4.0",
  "imageSourceUrl": "https://…",
  "gallery": [                          // isteğe bağlı ek görseller, sıra images.ts ile aynı
    { "credit": "Fotoğrafçı, Wikimedia Commons", "license": "CC BY-SA 4.0", "sourceUrl": "https://…" }
  ],
  "latitude": null,                     // doğrulanmadıkça null
  "longitude": null,
  "approxLatitude": 37.07,              // MVP haritası için yaklaşık
  "approxLongitude": 41.21,
  "coordinatesVerified": false,
  "estimatedVisitMinutes": 30,
  "tags": ["etiket1", "etiket2"],
  "isFeatured": false,
  "sources": [{ "title": "Kaynak", "url": "https://…" }],
  "verificationStatus": "needs_review"  // verified | needs_review
}
```

İkon/renk eşlemesi için: `src/theme/categories.ts`.

### Görseller ve galeri

Her mekanın görselleri `src/data/<sehir>/images.ts` içinde bir **dizi** olarak durur. Dizinin ilk
elemanlı ana görseldir ve künyesi mekanın `imageCredit` / `imageLicense` / `imageSourceUrl`
alanlarından gelir; kalan elemanlar `gallery` dizisiyle **sırayla** eşleşir. Mekan detay
sayfasındaki galeri yatay kaydırılır ve alttaki künye satırı o an görünen görseli izler.

`node scripts/validate-data.mjs` paketlenmiş görsel sayısı ile künye sayısının eşit olmasını ve
her galeri kaydında `credit`, `license`, `sourceUrl` bulunmasını zorunlu tutar, böylece yanlış
atıf yapılamaz.

## ➕ Yeni rota nasıl eklenir

İlgili şehrin `src/data/<sehir>/routes.json` dosyasına ekle; `poiIds`, aynı şehrin `places.json`
içindeki mevcut `id`'lere referans vermelidir:

```json
{
  "id": "ornek-rota",
  "title": "Örnek Rota",
  "description": "Açıklama",
  "estimatedDuration": "≈ 2 saat",
  "poiIds": ["mor-yakup-kilisesi", "zeynel-abidin-camii"],
  "difficulty": "kolay",
  "recommendedTime": "Sabah",
  "highlights": ["Öne çıkan 1"],
  "safetyNotes": ["Nazik ziyaret notu"]
}
```

## ➕ Yeni görev nasıl eklenir

İlgili şehrin `src/data/<sehir>/tasks.json` dosyasına ekle. `icon`, MaterialCommunityIcons adıdır;
`relatedPoiId` bir mekana bağlıysa o mekanın `id`'si, değilse `null`:

```json
{
  "id": "gorev-ornek",
  "title": "Örnek görevi tamamla",
  "description": "Kısa açıklama",
  "relatedPoiId": "mor-yakup-kilisesi",
  "points": 10,
  "category": "inanc-kultur",
  "icon": "book-open-variant"
}
```

İlerleme yüzdesi, tamamlanan görev sayısına göre otomatik hesaplanır.

---

## 📍 Gerçek koordinatlar nasıl güncellenir

1. Resmî/güvenilir bir harita kaynağından (örn. resmî turizm kaynakları, açık harita verisi)
   doğru enlem/boylamı bul.
2. İlgili mekanda `latitude` ve `longitude` değerlerini gir.
3. `coordinatesVerified` alanını `true` yap.
4. İsteğe bağlı: `approxLatitude` / `approxLongitude` aynı kalabilir (yedek olarak kullanılmaz).
5. Doğrulanmış konumlarda "yaklaşık" rozeti otomatik kaybolur.

> Kural: Koordinat kesin değilse `latitude`/`longitude` **null** kalmalı; harita yalnızca
> `approx*` değerlerini "yaklaşık" etiketiyle gösterir.

---

## ✅ Kaynak doğrulama süreci

1. Her tarihî iddia için en az bir **güvenilir kaynak** (`sources[]`) ekle.
2. Doğrulanmamış içeriği `verificationStatus: "needs_review"` ile işaretle.
3. `docs/research/nusaybin-tourism-research.md` içindeki **TODO** listesini güncel tut.
4. Görseller için lisans ve atıfı dosya sayfasından doğrula; `imageCredit` / `imageLicense` alanlarını kesinleştir.
5. Emin olunmayan tarihler "rivayete göre / kaynaklara göre" çerçevesinde sunulmalı; **uydurma yapılmamalı**.

---

## 🔒 Gizlilik notları

- Uygulama **ücretsizdir** ve **hesap/giriş istemez**.
- Konum **yalnızca uygulama açıkken** haritada kullanılır.
- Konum **sunucuya gönderilmez**; cihazdan çıkmaz.
- **Kişisel veri toplanmaz.** (Bkz. uygulama içi Gizlilik ekranı.)

---

## 🌍 Çoklu dil

- `tr`, `en` ve `ar` dosyaları **aynı anahtar kümesine** sahiptir; eksik anahtar `tr`'ye düşer.
  Metinleri hardcode etmek yerine `t('anahtar')` kullanın.
- Şehir adı geçen metinler `{{city}}` ile enterpole edilir, sabit yazılmaz.
- Hikâye içeriği `story.<sehir>` altında şehir başına tutulur (`blocks` ve `timeline` dizileriyle).
- Arapça için tam **RTL** düzeni MVP'de zorunlu kılınmamıştır; gelecek geliştirmedir.

---

## 🛣️ Gelecek geliştirmeler

- Gerçek, doğrulanmış koordinatlar ve resmî görseller (lisans/atıf ile).
- Backend + admin panel (mekan/rota/görev yönetimi), gerçek harita verisi.
- MapLibre ile tamamen sağlayıcıdan bağımsız vektör harita seçeneği.
- Tam RTL ve eksiksiz `en`/`ar` çevirileri.
- Çevrimdışı harita döşemesi önbelleği, rozet/başarımlar, favoriler.
- Erişilebilirlik iyileştirmeleri ve animasyon zenginleştirmeleri.

---

## 📝 Lisans / içerik notu

Görseller Wikimedia Commons katkıcılarına aittir ve cihazda paketlenir. Her mekan kaydında
`imageCredit`, `imageLicense` ve `imageSourceUrl` alanları bulunur; galerideki her ek görselin
künyesi de `gallery` içinde ayrı durur. Atıf, mekan sayfasının altında ve kaydırdıkça o an
görünen fotoğrafa göre gösterilir.

Commons'tan gelen bütün görsellerin lisansı ve yazarı Commons API'sinden okunarak doldurulmuştur
(CC BY 3.0, CC BY-SA 3.0, CC BY-SA 4.0 ve kamu malı). Üç Nusaybin kaydının görseli Commons'tan
değildir: Kültür İnanç Parkı'nın fotoğrafı Sinan Doğan'a aittir, Kaçakçılar Çarşısı ve Güzel
Züccaciye kayıtlarında ise künye alanı boştur ve bu durumda uygulama künye satırını hiç
göstermez. Bu iki kayda fotoğraf eklenirken künyesinin de girilmesi gerekir.
