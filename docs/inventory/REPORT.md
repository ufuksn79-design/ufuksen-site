# T-001 — WordPress Kaynak Sistem Envanteri

- Tarih: 2026-07-30
- Kaynak: `https://www.ufuksen.com/`
- Yöntem: Salt okunur HTTP GET (public REST API + sitemap + HTML head).
- Araç: `scripts/wordpress/inventory.py` (tekrar çalıştırılabilir)
- Kaynak sistemde **hiçbir veri değiştirilmedi**; yalnızca GET istekleri yapıldı.

## 1. Sistem Bilgileri

| Alan | Değer |
|---|---|
| WordPress | 6.8.6 |
| PHP | 7.4.33 (**EOL — güvenlik güncellemesi almıyor**) |
| Sunucu | Cloudflare önünde LiteSpeed |
| Tema | `jannah` (ticari ThemeForest teması, child theme tespit edilmedi) |
| SEO eklentisi | Rank Math |
| Veritabanı sürümü | **Bilinmiyor** — panel/SSH erişimi gerekiyor |

### Ana sayfada tespit edilen eklentiler

- `contact-form-7` — iletişim formları
- `greet-bubble-pro` — WhatsApp/karşılama balonu
- `mp-timetable` — ders/etkinlik takvimi (kendi `mp-event`, `mp-column` post type'ları var)
- `table-of-contents-plus` — yazı içi içindekiler

> Not: Bu liste yalnızca ana sayfada asset yükleyen eklentileri kapsar. Tam liste için `wp plugin list` çıktısı gerekir (bkz. Bilinmeyenler).

## 2. İçerik Adetleri

| Tür | Adet |
|---|---|
| Yazı (post) | 457 |
| Sayfa (page) | 16 |
| Kategori | 27 |
| Etiket | 4 |
| Medya | 795 |
| Yorum | 1401 |
| Kullanıcı | 3 |

Sitemap'ten dışa aktarılan public URL sayısı: **473** (457 yazı + 16 sayfa) → `docs/inventory/url-list.txt`

### Kayıtlı post type'lar

`post`, `page`, `attachment`, `guest-author` (Co-Authors Plus), `mp-event`, `mp-column` (MP Timetable), `rm_content_editor` (Rank Math), ve WP çekirdek tipleri.

## 3. URL Yapısı — Kritik Bulgu

Yazı permalink'leri **düz ve `.html` uzantılı**: `https://www.ufuksen.com/{slug}.html`

- 457 URL `.html` ile bitiyor, 472 URL tek seviye derinlikte, tarih/kategori öneki yok.
- Sayfalar uzantısız: `https://www.ufuksen.com/{slug}`
- 1 URL yüzde-encoded karakter içeriyor.
- **AMP aktif**: yazılarda `rel="amphtml"` mevcut → AMP URL'leri de redirect kapsamına girer.

Sonuç: Yeni sistem ya bu `.html` şemasını birebir korumalı ya da 457 yazı + AMP varyantları için 1:1 301 haritası üretmelidir. Bu, ADR-004'ün en somut uygulama gereksinimidir.

## 4. Kategori Dağılımı (yazı sayısına göre)

| Kategori | Yazı | Slug |
|---|---|---|
| Yaşam | 120 | `/yasam` |
| 3D Görselleştirme | 110 | `/3d-gorsellestirme` |
| Render Motorları | 109 | `/render-motorlari` |
| 3D Programlar | 68 | `/3d-programlar` |
| Sketchup | 61 | `/sketchup` |
| Vray Render | 35 | `/vray` |
| Genel | 34 | `/genel` |
| Twinmotion | 18 | `/twinmotion-render` |
| Render için Bilgisayar Tavsiyeleri | 16 | `/render-icin-bilgisayar-tavsiyeleri` |
| Render Bilgisayarları | 16 | `/render-bilgisayarlari` |
| D5 Render | 14 | `/d5-render` |
| Enscape Render | 13 | `/enscape-render` |

Kalan 15 kategori 10 ve altı yazı içeriyor (3ds Max, Lumion, Ücretsiz İçerikler, Render Analiz, 3D Proje Fiyatları, Corona, Unreal Engine, Yapay Zeka, Başarılar, Blender, Project Lavina, 3D Animasyon, Hakkımda, Youtube, Projeler).

Gözlem: Kategoriler çakışıyor (`Render Bilgisayarları` ve `Render için Bilgisayar Tavsiyeleri`; `3D Görselleştirme` hem kategori hem sayfa). Etiket sistemi pratikte kullanılmamış (4 etiket). T-002'de taksonomi konsolidasyonu değerlendirilmeli — **slug değişirse redirect zorunlu**.

## 5. Sayfa Envanteri (16)

`/sketchup-ozel-ders`, `/sikca-sorulan-sorular`, `/contact-form`, `/mimari-modelleme`, `/3d-gorsellestirme`, `/3d-mimari-gorsellestirme`, `/3d-render-gorsellestirme`, `/projeler`, `/sketchup-kurs`, `/ne-demisler`, `/projelerinizi-yapalim`, `/sketchup-ders`, `/iletisim`, `/ufuk-sen-kimdir`, `/amac` ve ana sayfa.

Gözlem: `/3d-gorsellestirme`, `/3d-mimari-gorsellestirme`, `/3d-render-gorsellestirme` ile `/sketchup-kurs`, `/sketchup-ders`, `/sketchup-ozel-ders` içerik olarak örtüşme riski taşıyor (SEO kanibalizasyonu). İçerik birleştirilirse redirect gerekir.

## 6. Örneklem İçerik Analizi (40 yazı)

Kabul kriteri "en az 20 örnek" — 40 yazı incelendi.

| Bulgu | Sonuç |
|---|---|
| Shortcode | **Tespit edilmedi** (0) |
| Gutenberg block yorumu | **Tespit edilmedi** (0) → içerik klasik editör HTML'i |
| Gömülü iframe | 35× YouTube, 3× Vidyard |
| Görsel host | 40/40 kendi domaini (`ufuksen.com/wp-content/uploads/...`) — harici hotlink yok |
| Boş özet (excerpt) | 0 |
| Öne çıkan görseli olmayan | 0 |

Migration açısından bu iyi haber: içerik gövdesi düz HTML, page builder (Elementor/WPBakery/Divi) izi yok, shortcode dönüşümü gerekmiyor. Ana dönüşüm işi **iframe embed'leri bileşene çevirmek** ve **görselleri yeniden barındırmak**.

> Uyarı: Örneklem en yeni 40 yazıdır. Eski yazılarda shortcode/page builder kullanımı olabilir; T-005'te tam export üzerinde 457 yazının tamamı taranmalıdır.

## 7. SEO Alanları

> **T-002 düzeltmesi (2026-07-30):** Aşağıdaki "REST'te SEO alanı yok" değerlendirmesi kısmen yanlıştı. Rank Math'in `getHead` endpoint'i gerçekten 404, ancak yazı `meta` alanı `rank_math_description` ve `rank_math_focus_keyword` değerlerini REST üzerinden veriyor (40/40 dolu). `focus_keyword` yalnızca REST ve WXR export'ta bulunuyor; head scrape'te yok. Ayrıntı: `docs/inventory/URL-MAP.md` §7.

Rank Math REST endpoint'i (`/wp-json/rankmath/v1/getHead`) **404** döndürüyor. Ancak SEO alanları sayfa HTML head'inden okunabiliyor:

- `<title>` (şablon: `{başlık} | 3D Eğitim`)
- `meta description`
- `rel=canonical`
- Open Graph + Twitter Card
- JSON-LD schema: `Article`, `BlogPosting`, `BreadcrumbList`, `ImageObject`, `Organization`, `Person`, `WebPage`, `WebSite`

Sonuç: SEO metadata iki yoldan alınabilir — (a) 473 URL'nin head'ini scrape etmek, (b) WordPress XML export + `rank_math_*` postmeta. **(b) tercih edilmeli**; scrape yalnızca doğrulama için kullanılmalı.

## 8. Formlar ve Harici Servisler

- Contact Form 7 → `/contact-form` ve `/iletisim`. Yeni sistemde form sağlayıcısı kararı açık (bkz. `decisions.md`).
- Greet Bubble Pro → WhatsApp yönlendirmesi.
- MP Timetable → ders programı; `mp-event`/`mp-column` verisi REST'te public değil, export gerekiyor.
- YouTube ve Vidyard gömüleri.
- Cloudflare (DNS/CDN) — geçiş planında DNS sahipliği doğrulanmalı.

## 9. Migration Riskleri

| # | Risk | Etki | Azaltma |
|---|---|---|---|
| R1 | `.html` permalink şeması | 457 URL'de trafik kaybı | Şemayı koru veya 1:1 301 haritası + smoke test |
| R2 | AMP URL varyantları (T-002: 914 URL, `?amp=1` ve `/amp`) | Ek 404 kaynağı | AMP URL'lerini kanonik sayfaya 301'le; query-string redirect desteği doğrulanmalı |
| R3 | Rank Math metadata REST'te yok | SEO alanları kaybı | XML export/postmeta üzerinden taşı, head scrape ile doğrula |
| R4 | 795 medya dosyası | Bozuk görsel | Checksum'lı indirme + hata raporu; sessiz atlama yasak |
| R5 | 1401 yorum | Etkileşim/SEO kaybı | Taşınacak mı kararı açık (bkz. `decisions.md`) |
| R6 | Örneklem yalnızca yeni yazılar | Gizli shortcode/builder | Tam export üzerinde 457 yazıyı tara |
| R7 | Kategori örtüşmesi ve kanibalizasyon | Slug değişimi → redirect borcu | T-002 URL eşleme tablosunda çöz |
| R8 | MP Timetable özel post type | İçerik kaybı | Export'ta dahil et veya kapsam dışı kararı ver |
| R9 | Jannah teması ticari | Yeni sistemde tema özellikleri yok | Kullanılan tema bileşenlerini bileşen listesine çıkar |
| R10 | PHP 7.4 EOL | Güvenlik | Geçiş süresince kaynak sistemi salt okunur tut |
| R11 | Türkçe karakter/URL encoding | Bozuk slug | Migration testine Türkçe karakter vakası ekle |
| R12 | Co-Authors Plus (`guest-author`) | Yazar bilgisi kaybı | Yazar eşleme tablosu üret |

## 10. Framework Kararına Girdi (ADR-002)

Ölçülen gerçekler:

- 473 statik sayfa; içerik değişim sıklığı düşük (son değişiklik 2026-07-23).
- İçerik gövdesi düz HTML — ağır runtime dönüşümü gerekmiyor.
- Etkileşim ihtiyacı sınırlı: navigasyon, arama, form, animasyon.
- Blog JS kapalıyken okunabilir olmalı (`architecture.md`).
- "Sadece animasyon için React ekleme" kuralı mevcut.

Bu veri **Astro**'yu işaret ediyor: 473 sayfa build-time'da statik üretilebilir, varsayılan sıfır JS ilkesi hem performans hem "JS kapalıyken okunabilir" gereksinimini karşılar, içerik dosya tabanlı yönetilebilir. Next.js'in avantajı (ISR, sunucu runtime) bu içerik profili için gerekli değil.

**Karar henüz kesinleştirilmedi** — T-005 migration proof-of-concept sonucunu bekliyor (todo.md: "Framework'ü kanıtsız biçimde kesinleştirme").

## 11. Bilinmeyenler

Public HTTP erişimiyle çözülemeyen, panel/SSH/DB erişimi gerektiren maddeler:

- [ ] Tam eklenti listesi (pasif eklentiler dahil)
- [ ] Veritabanı sürümü ve boyutu
- [ ] Child theme ve tema özelleştirmeleri
- [ ] Mevcut redirect kuralları (`.htaccess`, Rank Math Redirections)
- [ ] Yedekleme durumu ve geri yükleme testi
- [ ] Analytics/Search Console erişimi → **en çok trafik alan URL listesi çıkarılamadı**
- [ ] Menü ve widget yapıları
- [ ] Formların gittiği e-posta adresleri ve entegrasyonlar
- [ ] Kırık bağlantı taraması (473 URL için ayrı çalıştırma gerekir)
- [ ] Görsel telif/lisans durumu
- [ ] MP Timetable içerik hacmi
- [ ] Cloudflare hesap sahipliği ve DNS erişimi

## 12. Yedekleme Yöntemi (belgelenmiş, uygulanmadı)

Bu adım kaynak sisteme erişim gerektirir ve **henüz yapılmamıştır**. Önerilen sıra:

1. **Dosya yedeği**: `wp-content/` (uploads, themes, plugins) + `wp-config.php` → tar/zip, checksum kaydet.
2. **Veritabanı yedeği**: `wp db export` veya phpMyAdmin SQL dump (UTF-8, `utf8mb4`).
3. **İçerik export'u**: Araçlar → Dışa Aktar → Tüm içerik (WXR XML). Migration'ın birincil kaynağıdır.
4. **Doğrulama**: Yedeği ayrı bir staging ortamına geri yükle, yazı sayısının 457 olduğunu doğrula.
5. Yedek en az iki ayrı konumda saklanır; ham export değiştirilmeden arşivlenir.

**Doğrulanmış geri yükleme yapılmadan Faz 4'e (migration) geçilmemelidir.**

## 13. Kabul Kriterleri Durumu

| Kriter | Durum |
|---|---|
| Kaynak sistemde veri değiştirilmedi | ✅ Yalnızca GET |
| Sayısal envanter kayıt altına alındı | ✅ `inventory.json` |
| URL listesi dosyaya aktarıldı | ✅ 473 URL |
| En az 20 içerik örneği incelendi | ✅ 40 yazı |
| Shortcode/gömülü medya/özel alan örnekleri | ✅ Shortcode yok, embed ve SEO alanları belgelendi |
| Bilinmeyenler açıkça listelendi | ✅ Bölüm 11 |
| Tam yedekleme | ⚠️ Yöntem belgelendi, uygulanmadı (erişim yok) |
| En çok trafik alan URL'ler | ⚠️ Analytics erişimi yok |

## Yeniden Üretme

```bash
python scripts/wordpress/inventory.py --site https://www.ufuksen.com --sample 40
```
