# Nisibis — Nusaybin Keşif Rehberi

Nusaybin'i keşfetmek için **ücretsiz**, modern ve oyunlaştırılmış bir mobil şehir rehberi.
Android ve iOS'ta çalışan bir **Expo / React Native** uygulamasıdır. Ana ekran, görev odaklı
koyu bir **haritadır**: canlı konumunu görür, önemli durakları işaretçi olarak keşfeder,
"Buraya git" / "Tamamlandı" diyebilir ve Nusaybin turundaki ilerlemeni yüzde olarak takip edersin.

> MVP tamamen **çevrimdışı veriyle** çalışır (yerel JSON). Backend yoktur; ilerleme cihazda
> `AsyncStorage` ile saklanır. Yapı; ileride backend, admin panel ve gerçek harita verisi
> eklenebilecek şekilde modülerdir.

---

## ✨ Özellikler

- **Oyunlaştırılmış harita** (react-native-maps + ücretsiz, API anahtarsız koyu OSM döşemeleri).
- **Canlı konum** (expo-location) — izin reddedilse de uygulama çalışır.
- **Keşfet**: kategori filtreleri + arama (kahve, kilise, cami, çarşı, fotoğraf…).
- **Yer detayları**: tarihçe, aktiviteler, tavsiyeler, fotoğraf önerileri, ziyaret notları, kaynaklar.
- **Hazır rotalar** ve durak ilerlemesi.
- **Görev sistemi** + AsyncStorage ile kalıcı ilerleme.
- **i18n** altyapısı: `tr` (tam), `en` ve `ar` (placeholder).
- **Premium, Nusaybin kültürüne uygun tasarım**: koyu taban, altın vurgu, taş-toprak tonları,
  Fraunces (serif) + Inter (sans) tipografi, dokunsal geri bildirim.

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
  _layout.tsx              # Kök: fontlar, i18n, sağlayıcılar, Stack
  (tabs)/
    _layout.tsx            # Sekmeler + onboarding kapısı
    index.tsx              # Harita ekranı (ana)
    explore.tsx            # Keşfet
    routes.tsx             # Rotalar
    checklist.tsx          # Görevler
    settings.tsx           # Ayarlar
  place/[id].tsx           # Yer detay
  route/[id].tsx           # Rota detay
  onboarding.tsx           # Karşılama
  privacy.tsx              # Gizlilik
src/
  components/              # PlaceCard, RouteCard, TaskItem, BottomPlaceSheet, MapMarker, ...
  data/                    # places.json, routes.json, tasks.json
  hooks/                   # useLocation, usePlaces, useRoutes, useTasks, useProgress, useOnboarding
  storage/                 # taskStorage.ts (AsyncStorage)
  types/                   # place.ts, route.ts, task.ts, category.ts
  theme/                   # colors, spacing, typography, categories
  i18n/                    # tr.json, en.json, ar.json, index.ts
  utils/                   # distance, map, constants, color, icons
docs/research/             # nusaybin-tourism-research.md
```

---

## ➕ Yeni mekan nasıl eklenir

`src/data/places.json` dosyasına yeni bir nesne ekle (alanlar `src/types/place.ts` ile uyumlu olmalı):

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
  "image": "https://…",                 // boş bırakma — gerçek bir görsel kullan
  "imageCredit": "Wikimedia Commons katkıcıları",
  "imageLicense": "TODO: lisans doğrulanmalı",
  "imageSourceUrl": "https://…",
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

## ➕ Yeni rota nasıl eklenir

`src/data/routes.json` dosyasına ekle; `poiIds`, `places.json` içindeki mevcut `id`'lere referans vermeli:

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

`src/data/tasks.json` dosyasına ekle. `icon`, MaterialCommunityIcons adıdır; `relatedPoiId`
bir mekana bağlıysa o mekanın `id`'si, değilse `null`:

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

- `src/i18n/tr.json` tamdır. `en.json` İngilizce, `ar.json` Arapça (kısmi placeholder; eksik
  anahtarlar `tr`'ye düşer). Metinleri hardcode etmek yerine `t('anahtar')` kullanın.
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

Görseller Wikimedia Commons katkıcılarına aittir ve `Special:FilePath` ile referanslanır;
yayın öncesi her görselin lisansı doğrulanmalı ve uygun atıf (Ayarlar > Kaynaklar) sağlanmalıdır.
Bazı kayıtlarda temsilî yöresel görsel kullanılmıştır ve veride **TODO** ile işaretlenmiştir.
