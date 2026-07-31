# T-002 — İçerik Modeli ve URL Eşleme Tablosu

- Tarih: 2026-07-30
- Kaynak: `https://www.ufuksen.com/`
- Araçlar: `scripts/wordpress/url-map.py` (salt okunur, tekrar çalıştırılabilir)
- Çıktılar: `docs/inventory/url-map.csv`, `docs/inventory/url-map-stats.json`, `src/types/content.ts`

## 1. Eşleme Tablosu Özeti

Toplam **1418 satır** — kaynak sistemdeki her public URL biçimi için bir satır.

| Eylem | Satır | Anlamı |
|---|---|---|
| `keep` | 491 | URL birebir korunur, redirect gerekmez |
| `redirect` | 914 | 301 ile kanonik hedefe yönlendirilir |
| `decide` | 13 | Hedef henüz belirlenmedi, karar bekliyor |

| Tür | Satır |
|---|---|
| `post` | 457 |
| `post-amp` | 914 (yazı başına 2 varyant) |
| `page` | 15 |
| `category` | 27 |
| `tag` | 4 |
| `home` | 1 |

### Doğrulama

- Tekrarlanan legacy URL: **0** → redirect çakışması yok.
- Hedefi boş satır: 12 → tamamı `decide` eyleminde, bilinçli olarak boş.
- Script tekrarlanan URL bulursa çıkış kodu 1 döndürür.

## 2. Yazılar — Redirect Gerekmiyor

457 yazının tamamı `keep`. ADR-007 gereği `/{slug}.html` şeması birebir korunuyor, slug'lar değişmiyor. Bu, projedeki en büyük SEO riskini (457 URL'lik redirect zinciri) tamamen ortadan kaldırıyor.

Yeni sistemin karşılaması gereken tek koşul: `.html` uzantılı route üretebilmek. ADR-008'de Astro için doğrulanacak maddeler arasında.

## 3. AMP — Düzeltilmiş Bulgu

T-001'de AMP'nin aktif olduğu tespit edilmişti, ancak URL kalıbı doğrulanmamıştı. T-002'de ölçüldü:

| Biçim | Kaynak davranışı | Eylem |
|---|---|---|
| `/{slug}.html?amp=1` | 200 — `rel="amphtml"` ile ilan edilen kanonik biçim | 301 → `/{slug}.html` |
| `/{slug}.html/amp` | 200 — `?amp=1`'e yönleniyor | 301 → `/{slug}.html` |
| `/{slug}/amp` | 404 | eşleme gerekmez |

İlk tahminim `/{slug}/amp` idi ve **yanlıştı**; gerçek `amphtml` linki okunarak düzeltildi. Bu 914 redirect satırının kaynağıdır.

> Not: `?amp=1` bir query parametresi olduğu için sunucu/CDN katmanında yönlendirme kuralı yazılırken query string'in korunduğundan emin olunmalıdır. Bazı statik hosting sağlayıcıları query'ye göre redirect desteklemez — ADR-008 doğrulama listesine eklendi.

## 4. Karar Bekleyen 13 URL

### Sayfa örtüşmeleri (9 sayfa, 3 grup)

| Grup | URL'ler |
|---|---|
| 3D görselleştirme | `/3d-gorsellestirme`, `/3d-mimari-gorsellestirme`, `/3d-render-gorsellestirme` |
| SketchUp eğitim | `/sketchup-kurs`, `/sketchup-ders`, `/sketchup-ozel-ders` |
| İletişim | `/iletisim`, `/contact-form` |

Bu sayfalar birbirine yakın konularda ve SEO kanibalizasyonu riski taşıyor. Birleştirilirlerse kaldırılan her URL için 301 zorunlu. Karar `decisions.md` açık kararlar listesinde.

> Konsolidasyon otomatik yapılmadı. Hangi sayfanın trafik aldığını bilmeden birleştirme yapmak veri kaybıdır; bu, Analytics erişimi geldiğinde çözülmelidir (T-001 bloke maddesi).

### Etiketler (4)

Etiket sistemi pratikte kullanılmamış (4 etiket). Yeni sitede etiket arşivi olmayacaksa 4 URL 301'lenmeli.

### Boş kategoriler

`/projeler` kategorisi 0 yazı içeriyor. Kaldırılırsa 301 gerekir.

## 5. Slug Çakışmaları — Sorun Değil

İki slug hem yazı hem sayfa olarak mevcut:

| Slug | Yazı | Sayfa |
|---|---|---|
| `3d-gorsellestirme` | ID 2976 → `/3d-gorsellestirme.html` | ID 2522 → `/3d-gorsellestirme` |
| `3d-mimari-gorsellestirme` | ID 4687 → `/3d-mimari-gorsellestirme.html` | ID 1816 → `/3d-mimari-gorsellestirme` |

Yazılar `.html` uzantılı, sayfalar uzantısız olduğu için **URL çakışması yoktur**. Ancak yeni sistemde içerik dosyaları slug'a göre isimlendirilirse dosya adı çakışır — içerik deposu türe göre ayrılmalıdır (`content/posts/`, `content/pages/`).

Bu, `keep` kararının yan etkisi olarak ortaya çıkan somut bir uygulama kısıtıdır.

## 6. İçerik Modeli

`src/types/content.ts` — framework'ten bağımsız TypeScript tipleri. `tsc --noEmit` strict modda geçiyor.

Modeldeki tipler: `Post`, `Page`, `Taxonomy`, `Author`, `MediaAsset`, `Embed`, `SeoFields`, `UrlMapping`, `MigrationReport` ve yeni sitede tanıtılacak `Project`, `Plugin`, `Achievement`.

Tasarım kararları:

- **Ölçülen alanlar kullanıldı.** `architecture.md` taslağındaki model, gerçek REST çıktısına göre revize edildi. Örneğin `coauthors` alanı Co-Authors Plus'tan geldiği için `Author.isGuest` eklendi.
- **Hata gizlenmiyor.** `MediaAsset.localPath` indirme başarısızsa `null` kalır ve `error` doldurulur; `MigrationReport.mediaFailures` bunları taşır. Sessiz atlama `architecture.md` migration kurallarınca yasak.
- **Placeholder işaretli.** `Project`, `Plugin`, `Achievement` tiplerinde `isPlaceholder` zorunlu. `AGENTS.md`, placeholder içeriğin gerçek bilgi gibi yayınlanmasını yasaklıyor.
- **Doğrulama modele gömülü.** `migrationChecksum` ve `MigrationReport.countsMatch` ADR-006'nın karşılığı.

### Kapsam dışı bırakılanlar

- `mp-event` / `mp-column` (MP Timetable) — kapsam kararı açık.
- 1401 yorum — taşınma kararı açık; model henüz `Comment` tipi içermiyor.

Karar verildiğinde model genişletilecek.

## 7. SEO Alan Erişilebilirliği — T-001 Düzeltmesi

T-001'de "Rank Math REST endpoint'i 404, SEO alanları REST'te yok" denmişti. T-002'de yazı `meta` alanı incelendiğinde bu **kısmen yanlış** çıktı:

| Alan | REST `meta` | Sayfa `<head>` | WXR export |
|---|---|---|---|
| `rank_math_description` | ✅ 40/40 dolu | ✅ | ✅ |
| `rank_math_focus_keyword` | ✅ 40/40 dolu | ✖ | ✅ |
| SEO başlığı | ✖ | ✅ | ✅ |
| Canonical | ✖ | ✅ | ✅ |
| Open Graph / schema | ✖ | ✅ | ✅ |

Sonuç değişmiyor: **birincil kaynak WXR export olmalı**, çünkü tek başına ne REST ne de head scrape tüm alanları veriyor. Ancak `focus_keyword` yalnızca REST ve export'ta bulunuyor — head scrape'e güvenilirse bu alan kaybedilirdi.

## 8. Ölçülen İçerik Doluluğu (40 yazılık örneklem)

| Alan | Doluluk |
|---|---|
| Öne çıkan görsel | 40/40 |
| Özet (excerpt) | 40/40 |
| Kategori | 40/40 |
| Etiket | 0/40 |
| Yazar | tek yazar (ID 1), tümü `coauthors` taşıyor |
| Format | tümü `standard` |
| Sticky | 0/40 |

Yeni sistemde yazı formatı varyasyonu ve sticky post desteği gerekmiyor.

## 9. Yeniden Üretme

```bash
python scripts/wordpress/url-map.py --site https://www.ufuksen.com
```

```bash
npm run typecheck
```

## 10. T-002 Kabul Durumu

| Kriter | Durum |
|---|---|
| Her eski URL için hedef ve eylem belirlendi | ✅ 1418 satır, 13'ü bilinçli `decide` |
| Redirect çakışması yok | ✅ Doğrulandı, script kontrol ediyor |
| İçerik modeli tanımlandı | ✅ `src/types/content.ts`, strict typecheck geçiyor |
| Model gerçek veriye dayanıyor | ✅ REST alan envanteri çıkarıldı |
| Kaynak sistem değiştirilmedi | ✅ Yalnızca GET |
| Trafik verisine dayalı konsolidasyon | ⚠️ Analytics erişimi yok — 9 sayfa `decide` |
