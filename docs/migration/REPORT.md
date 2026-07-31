# WordPress → Astro Göç Raporu

- Tarih: 2026-07-30
- Kaynak: `https://www.ufuksen.com/` (salt okunur, yalnızca GET)
- Araçlar: `scripts/wordpress/migrate.py`, `scripts/wordpress/resolve-redirects.py`
- Doğrulama: `scripts/build/verify-urls.mjs`, `scripts/build/verify-content.mjs`

## 1. Sonuç

| Ölçüt | Kaynak | Hedef | Durum |
|---|---|---|---|
| Yazı | 457 | 457 | ✅ |
| Sayfa | 16 | 16 | ✅ |
| Kategori | 27 | 27 | ✅ |
| Etiket | 4 | 4 | ✅ |
| Medya (kütüphane) | 795 | 757 | ⚠️ bkz. §5 |
| Medya (içerik varyantları) | — | +1052 | ✅ |
| Üretilen sayfa | — | 525 | ✅ |

`keep` eylemli **491 URL'in tamamı** derlenmiş çıktıda gerçek bir dosyaya çözülüyor. Kaynak/hedef içerik adetleri birebir eşleşiyor (ADR-006).

## 2. Çalıştırma

```bash
npm run migrate:dry-run
```

```bash
npm run migrate:apply
```

```bash
npm run build && npm run verify
```

Migration idempotenttir: içerik değişmediyse dosyaya dokunulmaz, indirilmiş medya yeniden indirilmez.

## 3. En Kritik Bulgu — Kaynakta Görünmeyen 59 Yönlendirme

T-001 envanterinde "mevcut redirect kuralları" bilinmeyen olarak işaretlenmişti. Göç doğrulaması sırasında içerikteki bazı iç linklerin hedefte 404 verdiği görüldü. Kaynağa sorulduğunda bu URL'lerin **kırık olmadığı, 301 ile çalıştığı** ortaya çıktı:

| Eski URL | Kaynaktaki hedef |
|---|---|
| `/render-hatalari.html` | `/3d-render-hatalari.html` |
| `/sketchup-dosyasinda-verimli-calismak.html` | `/sketchup-dosya-verimliligi.html` |
| `/render-pc-tavsiyeleri-2018.html` | `/render-pc-tavsiyeleri.html` |
| `/kaplama` | `/` |

`resolve-redirects.py` 76 aday URL'i kaynağa sorarak **59 aktif yönlendirme** buldu ve `docs/migration/legacy-redirects.json` içine kaydetti.

Bu yönlendirmeler taşınmasaydı, şu anda çalışan ve SEO değeri taşıyan 59 URL yeni sitede 404 olacaktı — ADR-004'ün doğrudan ihlali. Bulgu yalnızca "linkler kırık" raporunu kabul etmek yerine kaynağa sorulduğu için ortaya çıktı.

Sonuç:

- 59 kural `public/_redirects` içine yazıldı (`generate-redirects.mjs`).
- İçerikteki 83 iç link doğrudan nihai hedefe çevrildi; gereksiz yönlendirme adımı kalmadı.
- 16 URL kaynakta da 404 dönüyor; yönlendirme hedefi yok, 404 doğru davranış.

## 4. URL Şeması

| Tür | Şema | Yöntem |
|---|---|---|
| Yazı | `/{slug}.html` | Astro dizin formatı + build sonrası düzleştirme |
| Sayfa | `/{slug}` | dizin indeksi |
| Kategori | `/kategori/{...}` | kaynaktaki gerçek hiyerarşik yol |
| Blog | `/blog`, `/blog/2`… | 20'şerli sayfalama |

Yazılar ve sayfalar aynı slug'ı paylaşabildiği için (`3d-gorsellestirme` hem yazı hem sayfa) düz dosya formatı çakışma üretiyordu. Çözüm: dizin formatında derle, ardından `flatten-html-routes.mjs` ile yazıları düz `.html` dosyasına indir. Böylece her iki URL de **tam dosya eşleşmesiyle** çalışır ve hosting'in "clean URL" davranışına bel bağlanmaz.

## 5. Medya

| Aşama | Sonuç |
|---|---|
| Kütüphane (REST) | 757 indirildi, 0 hata |
| İçerik varyantları | 1052 indirildi |
| Kaynakta da bulunmayan | 2 |

İki ayrı sorun çözüldü:

**Sayfalama.** REST medya endpoint'inin 2. sayfası 100 yerine 74 kayıt döndürüyor. "100'den az geldi, bitti" varsayımı 795 kaydın 621'ini sessizce düşürüyordu. Tek güvenilir ölçüt `X-WP-TotalPages` başlığı.

**Boyut varyantları.** WordPress gövdede orijinal yerine yeniden boyutlandırılmış dosyalara referans veriyor (`...-1024x741.png`). Bunlar medya kütüphanesinde ayrı kayıt olmadığı için REST listesinde yok. Yalnızca kütüphaneyi indirmek 130 görseli kırık bırakıyordu; içerikte geçen referanslar ayrıca taranıp indirildi.

REST listesi 795 yerine 758 kayıt veriyor (37 fark). Bu kaynak sistem tutarsızlığıdır, rapora yazıldı; içerikte referans verilen hiçbir görsel eksik değil.

## 6. SEO Alanları

Her yazı ve sayfa için Rank Math verisi taşındı:

| Alan | Kaynak |
|---|---|
| SEO başlığı | sayfa `<head>` (473 sayfa tarandı, 0 hata) |
| Açıklama | REST `meta.rank_math_description` + head |
| Odak anahtar kelime | REST `meta.rank_math_focus_keyword` |
| Canonical | head |
| OG görseli | head + yerel öne çıkan görsel |

Yeni sitede ayrıca üretilen: JSON-LD (`BlogPosting`, `WebPage`, `CollectionPage`, `Person`), Open Graph, Twitter Card, `sitemap-index.xml`, `rss.xml`, `robots.txt`.

## 7. İçerik Dönüşümü

- `wp-content/uploads/...` → `/media/...`
- İç mutlak linkler köke göreli
- Ek-dosya (attachment) linkleri üst içeriğe (kaynak da 301'liyor)
- Eski arama linkleri `/arama?q=`
- Görsellere `loading="lazy"` + `decoding="async"`; öne çıkan görselde `fetchpriority="high"`
- Gömüler (YouTube, Vidyard) korundu, responsive çerçeveye alındı

İçerik metni değiştirilmedi, özetlenmedi, yeniden yazılmadı.

## 8. Bilinen ve Kaynağa Karşı Doğrulanmış Sorunlar

`docs/migration/known-issues.json` — hepsi kaynak sistemde de mevcut, göç kaynaklı değil:

| Sorun | Adet | Kanıt |
|---|---|---|
| Boş sayfa gövdesi | 3 | `ne-demisler`, `projeler`, `tiehome` canlı sitede de boş |
| Kaynakta bulunmayan görsel | 2 | canlı sitede de 404 |
| Kaynakta 404 dönen iç link | 16 | HTTP ile doğrulandı |
| Çözülemeyen (ağ hatası) | 1 | tekrar sorgulanmalı |

Doğrulama aracı bunları "bilinen" olarak ayırır; **yeni** bir bozulma çıkarsa build kırılır.

## 9. Doğrulama Çıktısı

```text
URL doğrulaması
  eşleme satırı      : 1418
  keep (doğrulandı)  : 491
  redirect (host)    : 914
  decide (açık)      : 13
  çözülemeyen        : 0

İçerik doğrulaması
  taranan sayfa      : 525
  canonical yok      : 0
  title yok          : 0
  boş gövde (YENİ)   : 0
  eksik medya (YENİ) : 0
  kırık link (YENİ)  : 0
```

## 10. Yapılmayanlar

- **Yedekleme** — WordPress dosya/DB yedeği alınamadı (panel/SSH erişimi yok). Faz 7 öncesi zorunlu.
- **Yorumlar** — 1401 yorum taşınmadı; karar açık.
- **MP Timetable** — `mp-event` / `mp-column` içeriği kapsam dışı; karar açık.
- **Trafik verisi** — Analytics erişimi olmadığı için örtüşen 9 sayfanın konsolidasyonu yapılmadı.
- **Yayına alma** — DNS/hosting erişimi yok.
