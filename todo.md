# Sıradaki İşler

## Aktif Görev

**Aktif görev yok — teknik iş tamamlandı.** Kalan maddeler kullanıcı erişimi bekliyor (aşağıda).

---

## T-001 — Mevcut WordPress sitesinin salt okunur teknik ve içerik envanteri

Durum: **Public erişimle yapılabilen kısım tamamlandı.** Rapor: `docs/inventory/REPORT.md`.
Kalan iki madde kaynak sistem erişimi (WP paneli / SSH / Analytics) gerektiriyor ve bloke.

### Amaç

Yeni tasarıma başlamadan önce kaynak sistemin ne içerdiğini eksiksiz belirlemek.

### Alt Görevler

- [x] Tam yedekleme yöntemini belgele — REPORT.md §12 (yöntem belgelendi; **uygulanmadı**, erişim yok)
- [x] WordPress sürümünü kaydet — 6.8.6 / PHP 7.4.33
- [x] Tema ve eklenti listesini çıkar — jannah + 4 eklenti (yalnızca ana sayfada görünenler)
- [x] Yazı, sayfa, kategori, etiket ve medya sayılarını çıkar — 457/16/27/4/795
- [x] Tüm public URL'leri dışa aktar — `docs/inventory/url-list.txt` (473)
- [x] SEO eklentisi alanlarını belirle — Rank Math; REST kapalı, head'den okunabilir
- [x] Shortcode ve page builder kullanımını tara — 40 yazıda shortcode/builder yok
- [x] Formları ve harici servisleri belirle — CF7, Greet Bubble, MP Timetable, YouTube, Vidyard
- [ ] En çok trafik alan URL'leri listele — **BLOKE: Analytics/Search Console erişimi yok**
- [x] İçerik göçü risklerini raporla — 12 risk, REPORT.md §9
- [x] `decisions.md` için framework kararına girdi hazırla — REPORT.md §10
- [x] Envanter sonucunu `changelog.md` dosyasına ekle

### Kullanıcıdan Beklenen (T-001'i kapatmak için)

1. WordPress yönetici paneli veya SSH erişimi — tam eklenti listesi, `.htaccess`/redirect kuralları, menü/widget yapısı, MP Timetable içeriği
2. Tam WXR export (Araçlar → Dışa Aktar) — SEO postmeta ve 457 yazının tamamının taranması için
3. Google Analytics / Search Console erişimi — trafik açısından kritik URL listesi
4. Doğrulanmış yedek (dosya + DB) — Faz 4 öncesi zorunlu
5. Cloudflare/DNS erişim durumu

### Kabul Kriterleri

- Kaynak WordPress sisteminde hiçbir veri değiştirilmemiş olmalı.
- Sayısal envanter kayıt altına alınmalı.
- URL listesi dosyaya aktarılmalı.
- En az 20 farklı içerik örneği migration açısından incelenmeli.
- Shortcode, gömülü medya ve özel alanlar için örnekler bulunmalı.
- Bilinmeyenler açıkça listelenmeli.

### Bu Görev Bitmeden Yapılmayacaklar

- WordPress sitesini kapatma
- URL yapısını değiştirme
- Üretim DNS değişikliği
- İçeriği manuel kopyalama
- Eski medya dosyalarını silme
- Framework'ü kanıtsız biçimde kesinleştirme

---

## T-002 — İçerik modeli ve URL eşleme tablosu

Durum: **Tamamlandı** (trafik verisi gerektiren konsolidasyon kararları hariç).
Rapor: `docs/inventory/URL-MAP.md`

### Alt Görevler

- [x] Tüm public URL'ler için hedef ve eylem belirle — 1418 satır (`docs/inventory/url-map.csv`)
- [x] Redirect çakışması kontrolü — 0 tekrar; script çakışmada exit 1 döndürüyor
- [x] AMP URL kalıbını doğrula — `?amp=1` ve `/amp`, 914 redirect satırı
- [x] Slug çakışmalarını incele — 2 çakışma, URL çakışması değil; içerik deposu türe göre ayrılmalı
- [x] İçerik modelini tanımla — `src/types/content.ts`, strict `tsc --noEmit` geçiyor
- [x] Modeli gerçek REST alan envanterine göre doğrula
- [x] TypeScript type-check altyapısını kur — `npm run typecheck`
- [ ] Örtüşen 9 sayfanın konsolidasyonu — **BLOKE: trafik verisi olmadan karar verilemez**

---

## T-003 — Tasarım tokenları ve iki ana sayfa yönü

Durum: **Tamamlandı.** Rapor: `docs/design/T-003-DIRECTIONS.md`
Önizleme: `http://localhost:4321/prototypes/index.html`

### Alt Görevler

- [x] Font lisansı ve Türkçe karakter doğrulaması — Geist / Geist Mono / Fraunces, SIL OFL 1.1, 9/9 glif kanıtlandı
- [x] Tasarım tokenları — `src/styles/tokens.css`
- [x] 60–30–10 renk sistemi
- [x] Tipografi ölçeği (akışkan `clamp`)
- [x] Reduced-motion davranışı
- [x] İki ana sayfa yönü prototipi
- [x] Mobil hamburger menü + klavye erişimi
- [x] 320 / 375 / 430 / 1280 px doğrulaması
- [x] Başlıkların dolu sarı olduğunun doğrulanması (32/32)
- [x] JS kapalı senaryosunda içerik okunabilirliği
- [x] **Yön seçimi — Yön A (Blueprint) uygulandı.** Karar bana bırakıldı; gerekçe: 457 yazılık arşivde A'nın liste/satır dili kart tekrarına düşmüyor. Yön B prototipi `prototypes/direction-b.html` içinde duruyor, istenirse geçilebilir.

## Tamamlananlar (T-004 – T-007)

- [x] **T-004 — Mobil geçiş.** Hamburger menü, sıkıştırılmış dikey ritim, akışkan başlık ölçeği. 320/375/430 px'te yatay taşma yok, 44px altı bağımsız dokunma hedefi yok. Satır içi metin bağlantıları WCAG 2.5.8 gereği muaf.
- [x] **T-005 — Migration.** Dry-run + apply, idempotent, checksum ve adet doğrulamalı. 457 yazı, 16 sayfa, 27 kategori, 1809 medya dosyası. Rapor: `docs/migration/REPORT.md`.
- [x] **T-006 — Ana sayfa ve site.** Yön A uygulandı; yazı, sayfa, kategori, blog sayfalama, arama, 404, RSS, sitemap.
- [x] **T-007 — Mikro etkileşimler.** Scroll reveal (IntersectionObserver), hero parallax, hover mikro geçişleri. Hepsi `prefers-reduced-motion` ve JS kapalı senaryosunda güvenli.

## Kalan İşler — Kullanıcı Erişimi Gerektirenler

Bunlar teknik olarak hazır ama **benim erişemediğim kaynaklar** olmadan tamamlanamaz.

### Zorunlu (Faz 7 öncesi)

- [x] **WordPress tam yedeği** — kullanıcı tarafından alındı (dosya + veritabanı)
- [x] **Hosting erişimi** — GüzelHosting, cPanel + FTP; `.htaccess` üretildi
- [x] **Staging yayında** — `https://www.ufuksen.com/yeni/`, 45/45 URL örneklemi 200
- [ ] **Canlıya geçiş onayı** — kullanıcı kararı bekliyor (aşağıdaki kontrol listesi)

### Canlıya Geçiş Kontrol Listesi

- [x] Yedek alındı
- [x] Staging'de içerik doğrulandı
- [x] `.htaccess` kuralları sunucuda test edildi (DirectorySlash düzeltmesi)
- [ ] Mevcut WordPress `.htaccess` dosyası ayrıca indirildi (rollback için)
- [ ] 59 yönlendirmenin canlıda test edilmesi (ancak geçişten sonra mümkün)

### Karar bekleyen

- [ ] **Analytics / Search Console erişimi** — örtüşen 9 sayfanın (3D görselleştirme, SketchUp eğitim grupları) konsolidasyonu trafik verisi olmadan yapılamaz
- [ ] 1401 yorum taşınacak mı?
- [ ] MP Timetable (`mp-event`/`mp-column`) içeriği kapsama alınacak mı?
- [ ] 4 kullanılmayan etiket ve boş `/projeler` kategorisi kaldırılacak mı?

### İçerik

- [ ] Eklenti, eğitim seti, proje ve sertifika bilgileri **yer tutucu**. Gerçek veri girilene kadar arayüzde "YER TUTUCU" etiketiyle işaretli.
- [ ] `info@ufuksen.com` varsayılan; doğru iletişim adresi teyit edilmeli.
- [ ] 16 kırık iç link editoryal düzeltme bekliyor (kaynakta da 404).

### Yapılmayanlar

- [ ] Lighthouse ölçümü — anlamlı sonuç için gerçek hosting üzerinde çalıştırılmalı
- [ ] `frontend-design` ve `ui-ux-pro-max` skill kurulumu (`AGENTS.md` §3) — yapılmadı
- [ ] Otomatik test paketi (unit/E2E) — doğrulama şu an script tabanlı
