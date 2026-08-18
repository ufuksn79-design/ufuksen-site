# Yeni Ürün Ekleme

Ürün eklemek kod değişikliği gerektirmez (ADR-022). İki yol var.

## Yol 1 — Panelden (önerilen)

1. Panele girin: `/admin`
2. Sol menüden **Ürünler** → **Yeni Ürün**
3. Alanları doldurun, **Yayınla**

Kaydettiğinizde depoya commit gider, Cloudflare siteyi yeniden üretir; birkaç
dakikada yayında olur.

### Zorunlu alanlar

| Alan | Not |
|---|---|
| Ad | Ürünün adı |
| URL adresi (slug) | Sayfa adresi olur: `/urunler/{slug}`. Yayınlandıktan sonra **değiştirmeyin** |
| Tür | Eklenti / Web aracı / Şablon |
| Durum | Yayında / Beta / Alfa / Geliştiriliyor / Arşiv |
| Özet | Kartta görünen tek cümle |

Geri kalan her alan isteğe bağlıdır ve **boş bırakıldığında sayfada hiç
görünmez** — boş başlık ya da yer tutucu metin basılmaz.

### Hazır olmayan ürün

**Sitede göster** anahtarını kapatın. Kayıt panelde durur, sitede hiçbir yerde
görünmez. Hazır olunca açarsınız.

### Sıralama

**Sıra** alanı küçükten büyüğe dizer. Aynı sıradakiler ada göre alfabetik gelir.

## Yol 2 — Dosya olarak

`src/content/products/{slug}.json` oluşturun. En küçük geçerli kayıt:

```json
{
  "slug": "ornek-urun",
  "ad": "Örnek Ürün",
  "tur": "eklenti",
  "durum": "aktif",
  "ozet": "Tek cümlelik özet."
}
```

Kalan alanlar varsayılanlarıyla doldurulur. Şema `src/content.config.ts`
içinde; hatalı veri girilirse **derleme durur**, sessizce yanlış sayfa
üretilmez.

## Bölümler ne zaman görünür?

| Bölüm | Görünme koşulu |
|---|---|
| Kapak görseli | `kapak` doldurulmuşsa |
| Tanıtım videosu | `video.youtubeId` girilmişse |
| Ne işe yarar? | `aciklama` yazılmışsa |
| Özellikler | En az bir özellik varsa |
| Ekran görüntüleri | Galeriye görsel eklenmişse |
| Listeler | En az bir liste varsa (her liste kendi başlığıyla çıkar) |
| Uyumluluk | En az bir satır varsa |
| Sık sorulanlar | En az bir soru varsa |
| Fiyat rozeti + "Satın al" | `fiyat.tutar` girilmişse |
| "Ayrıntılar hazırlanıyor" | Yukarıdakilerin **hiçbiri** yoksa |
| İlgili yazılar | `yazilim` alanı doldurulmuşsa (arşivden otomatik) |

## Süzgeç

Ürün sayısı **5'e ulaştığında** ve birden fazla tür varsa liste sayfasında tür
süzgeci kendiliğinden belirir. Daha az üründe süzgeç gürültü olacağı için
gizlidir. Elle açıp kapatmak gerekmez.

## Görseller

Panelden yüklenen görseller `public/media/yuklenen/` altına gider. Elle
koyacaksanız `public/media/urun/` kullanın ve yolu `/media/urun/dosya.jpg`
biçiminde yazın.

**Alternatif metni boş bırakmayın** — görselde ne olduğunu yazın. Hem ekran
okuyucular hem Google bunu okur.

## İkonlar

Özellik ikonları `src/lib/products.ts` içindeki `IKONLAR` kümesinden gelir:

`grid` · `bolt` · `ruler` · `sliders` · `layers` · `texture` · `kesim` ·
`kutu` · `indir` · `bulut` · `kod` · `onay` · `saat` · `goz`

Bilinmeyen bir ad girilirse `grid` kullanılır; sayfa bozulmaz. Yeni ikon için
`IKONLAR` kümesine bir SVG yolu eklemek yeterlidir.

## İlgili yazılar nasıl bağlanıyor?

**İlgili yazılım** alanına `sketchup`, `vray`, `d5-render` gibi bir değer
yazarsanız, ürün sayfasının altına arşivden o yazılıma ait gerçek yazılar
gelir. Geçerli değerler `src/lib/discover.ts` içindeki `SOFTWARE` listesindedir.
