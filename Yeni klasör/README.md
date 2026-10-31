# PALETÇİM

**Palet Ticaretinin Dijital Merkezi.** Web ve mobil B2B palet pazaryeri, Firebase bulut altyapısı ve TypeScript monorepo.

## Bu aşamada hazır olanlar

- Mobil uyumlu Türkçe Next.js web arayüzü; ilan arama, şehir/kategori filtresi, fiyat sıralama, ilan detayı ve üyelik akışı.
- Firebase Web SDK ile Firebase Authentication, Cloud Firestore ve Cloud Functions bağlantı katmanı.
- Firebase Security Rules: ilanlar herkese açık, satıcı profili/mesajlaşma/ilan yayınlama aktif ve e-posta doğrulanmış üyelik gerektirir.
- Cloud Functions ile kayıt ücreti ve ilan boost checkout sözleşmeleri. Güvenilir ödeme sağlayıcısı adapterı kurulmadığından ödeme çağrıları başarısız güvenli durumda kalır; ödeme veya üyelik aktivasyonu taklit edilmez.
- Firestore kampanya/banner/slider koleksiyonu; yalnızca yönetici tarafından açılmış aktif kampanyalar web slider’ında gösterilir.
- `boostedUntil` ilan görünürlüğü alanı ve istemci yazmasını engelleyen kurallar. Boost paketleri ve kampanya fiyatları admin tarafından yönetilebilir.
- Expo mobil uygulaması için Firebase SDK bağlantı dosyası.

## Windows kurulumu

Gereksinimler: Node.js 22+, pnpm 10.12.1 ve Firebase projesi. Firebase Console’da Web uygulaması oluşturup Authentication’da e-posta/şifre girişini ve Firestore’u etkinleştirin.

```powershell
corepack enable
corepack prepare pnpm@10.12.1 --activate
pnpm install
Copy-Item .env.example apps/web/.env.local
```

`apps/web/.env.local` içindeki `NEXT_PUBLIC_FIREBASE_*` alanlarını Firebase Web uygulaması ayarlarından doldurun. `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY` için Firebase App Check’te web uygulamasına reCAPTCHA v3 sağlayıcısı bağlayın; ödeme ve boost Cloud Functions çağrıları App Check gerektirir. Mobil uygulama için aynı değerleri `EXPO_PUBLIC_FIREBASE_*` adlarıyla ortam değişkeni olarak tanımlayın. Firebase API key istemci yapılandırmasıdır; Admin SDK özel anahtarı veya ödeme sağlayıcısı sırları buraya konmaz.

Web ve mobil:

```powershell
pnpm dev:web       # http://localhost:3000
pnpm dev:mobile    # Expo geliştirme sunucusu
```

## Vercel önizleme yayını

Vercel projesinin Root Directory ayarı `apps/web` olmalıdır. Framework `Next.js` ve build komutu `pnpm exec next build` olarak belirlenir; diğer ayarlar otomatik algılanabilir. İlk önizleme için Vercel CLI proje bağlantısı ve oturum ister:

```powershell
pnpm dlx vercel@latest --cwd apps/web
```

Bu workspace’te henüz Firebase production değerleri bulunmuyor. Önizleme arayüzü Firebase yapılandırma uyarısı gösterir; Firebase Web/App Check değişkenleri Vercel Project Settings → Environment Variables bölümüne eklenmeden kayıt, ilan ve mesaj verisi çalışmaz. Canlı dağıtım ve özel alan adı ayrıca Vercel projesine/alan adına bağlıdır.

Firebase CLI ve emülatörler:

```powershell
pnpm dlx firebase-tools@15.34.2 login
pnpm dlx firebase-tools@15.34.2 use --add
pnpm firebase:emulators
```

Web emülatör bağlantısını açmak için `.env.local` içinde `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` ayarlayın. Kurallar, dizinler ve Storage kurallarını gözden geçirip Firebase projenize gönderin:

```powershell
pnpm firebase:deploy:rules
```

Functions bağımlılıklarını ve derlemeyi doğrulayıp dağıtmak için:

```powershell
pnpm --filter @paletcim/functions build
pnpm dlx firebase-tools@15.34.2 deploy --only functions
```

Next.js uygulaması Firebase App Hosting’de yayınlanabilir. Firebase Console’da App Hosting backend oluştururken uygulama kökünü `apps/web` seçin; Next.js 16 sürümleri Firebase’in resmi aktif destek tablosunda henüz listelenmediği için dağıtım öncesi [uyumluluğu kontrol edin](https://firebase.google.com/docs/app-hosting/frameworks-tooling) veya desteklenen sürüme sabitleyin. `.env.local` değerlerini backend ortam değişkenlerine ekleyin. Functions deploy için Blaze planı ve ödeme sağlayıcısı sırlarını Firebase Secret Manager’da ayrıca yapılandırın.

## Ücret ve erişim modeli

Kayıt erişim bedeli sunucu tarafında **35.000 kuruş / 350 TL** olarak tutulur. İlanları inceleme açık; satıcı profili, mesajlaşma ve ilan yayınlama Firebase kurallarıyla aktif üyeliğe bağlanmıştır. Üyelik yalnızca sağlayıcıdan imzalı ve doğrulanmış başarılı ödeme bildirimi işlendikten sonra açılmalıdır. Sağlayıcı seçimi, webhook imza doğrulaması, iade akışı, vergi dahil toplam fiyat, sözleşmeler ve yönetici kampanya/boost paneli bu teslimatta tamamlanmadı.

## Firebase belge modeli

- `users/{uid}`: üyelik durumu, doğrulama ve erişim kaydı; istemciden yazma kapalı.
- `sellerProfiles/{uid}`: firmaya ait özel profil; aktif ücretli üyelere açık.
- `listings/{id}`: herkese açık aktif ilan, sahiplik ve boost alanı sunucu tarafından korunur.
- `conversations/{id}/messages/{id}`: tarafları doğrulanmış, ücretli üyeler arası mesajlaşma.
- `payments/{id}`, `boostPackages/{id}`, `boostPurchases/{id}`: ödeme/boost kayıtları; istemci yazamaz.
- `campaigns/{id}`, `adSlots/{id}`, `advertisingPackages/{id}`: admin yönetimli slider, banner ve reklam alanları.

`apps/api` altındaki NestJS sağlık ucu önceki iskeletten korunmuştur; bu Firebase akışında kullanılmıyor. PALETÇİM kullanıcı, ilan ve üyelik akışı Firebase servisleri üzerinden çalışır.
