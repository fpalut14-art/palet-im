# PALETÇİM pazaryeri deneyimi

Ticaret arayüzü palet ilanı bulma ve satıcıya güvenli şekilde ulaşma akışına göre tasarlanıyor.

- Ana sayfada ilan araması ve palet kategorileri önde; kullanıcı ilanları keşfetmek için hesap açmak zorunda değil.
- İlan listesinde kategori, şehir ve ölçü araması ile fiyat sıralaması bulunuyor. Filtreler mobil ekranda da doğrudan erişilebilir.
- İlan kartında gerçek fiyat, ölçü, stok ve konum gösteriliyor. Gerçek ilan bulunmadığında sahte ürün/yorum/fiyat yerine boş durum gösteriliyor.
- Firma kimliği, telefon ve platform mesajı, doğrulanmış ve 350 TL üyelik ödemesi sunucu tarafından onaylanmış hesaba açılıyor.
- Ücret ödeme adımında açıkça gösteriliyor. Vergi dahil toplam fiyat, taraf bilgileri, iptal/iade ve sözleşmeler netleşmeden ödeme sağlayıcısı canlıya alınmıyor.
- Sponsorlu reklam kampanyaları ilanlardan ayrı kampanya kaydında yayınlanır; slider’da sponsor etiketi gösterilir. Satın alınmış boost bilgisi `boostedUntil` alanından gelir; istemci bu alanı değiştiremez.
- Palet odaklı yerel pazaryerlerinde kategori/ölçü araması, 81 il kapsamı, firma rehberi ve vitrinde öne çıkarma kullanılıyor. PALETÇİM bunları tek bir mobil arama akışında birleştirip ücretli vitrini sponsor etiketiyle ayıracak: [Palet Pazarı](https://www.paletpazari.com/), [Palet Borsası](https://www.paletborsasi.com/).

Tasarım kararları e-ticaret ürün listelerinde kolay filtreleme/sıralama ve arama sonuçlarını taranabilir kılma araştırmasından yararlanır: [Baymard ürün listesi ve filtreleme araştırması](https://baymard.com/research/ecommerce-product-lists). Firebase veri erişimi varsayılan olarak kapalı güvenlik kuralları ve istemciden bağımsız yetkilendirme ile korunur: [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist), [Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/overview).
