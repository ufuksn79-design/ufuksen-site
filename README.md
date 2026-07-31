# Ufuk Şen Website Platform

Ufuk Şen'in mevcut WordPress sitesini premium, hızlı, responsive ve içerik kaybı yaşamadan yeni bir sisteme taşıma projesi.

## Başlamadan Önce

Bu repository üzerinde işlem yapacak kişi veya agent önce şu dosyaları okumalıdır:

1. `PROJECT.md`
2. `AGENTS.md`
3. `PHASES.md`
4. `ROADMAP.md`
5. `architecture.md`
6. `todo.md`
7. `decisions.md`
8. `lesson.md`
9. `changelog.md`

## Gereksinimler

- Node.js 20+ (test edilen: 24.14.0)
- Python 3.11+ (migration scriptleri)
- Modern tarayıcı

Pinlenen sürümler: Astro 7.1.6, Tailwind 4.3.3, TypeScript 5.9.2.

Sürüm numaraları framework seçildikten sonra burada pinlenecektir. “En son sürüm” ifadesi yerine doğrulanmış kesin sürüm kullanılacaktır.

## Claude Code Skill Kurulumu

Kullanılması planlanan skill'ler:

- Anthropic frontend-design:
  `https://github.com/anthropics/skills/tree/main/skills/frontend-design`
- UI UX Pro Max:
  `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`

### Güvenli kurulum prosedürü

1. Depoların resmi ve beklenen kaynak olduğunu doğrula.
2. README/SKILL.md içindeki güncel kurulum komutunu oku.
3. Kurulum komutunu tahmin etme.
4. Çalıştırılacak install scriptlerini incele.
5. Mümkünse sürümü veya commit'i pinle.
6. Kurulum sonucunu `changelog.md` dosyasına kaydet.

> Not: UI UX Pro Max bir “npm paketi” gibi kurulabilir veya kendi CLI talimatını kullanabilir; güncel depo talimatı doğrulanmadan `npm install` komutu uydurulmayacaktır.

## Kurulum

```bash
npm install
```

## Geliştirme Komutları

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run typecheck
```

Not: `npm run test` ve `npm run lint` **yok**. Doğrulama şu an script tabanlı
(`verify-urls`, `verify-content`) ve `astro check` ile yapılıyor. Otomatik test
paketi henüz kurulmadı; belgeyi gerçeğe uydurmak yerine eksik olduğu yazıldı.

## WordPress Migration

```bash
npm run migrate:dry-run
```

```bash
npm run migrate:apply
```

```bash
npm run build && npm run verify
```

Kaynaktaki mevcut yönlendirmeleri keşfetmek için (build sonrası çalışır):

```bash
python scripts/wordpress/resolve-redirects.py
```

Sonuç raporu: `docs/migration/REPORT.md`

Kurallar:

- Önce dry-run
- Kaynak sisteme yazma yok
- Ham export saklanır
- Hata raporu üretilir
- İşlem tekrar çalıştırılabilir olmalı
- Production migration öncesi staging doğrulaması yapılmalı

## Proje Nasıl Çalışır?

Genel mimari:

- Frontend, hızlı ve SEO uyumlu sayfalar üretir.
- İçerik katmanı blog yazılarını, projeleri, eklentileri ve başarıları yönetir.
- Migration katmanı WordPress verisini hedef şemaya dönüştürür.
- Redirect katmanı eski URL'leri korur.
- SEO katmanı metadata, canonical, sitemap, RSS ve structured data üretir.
- Tasarım sistemi renk, tipografi, spacing, motion ve component kurallarını merkezileştirir.

## Arıza Sonrası İlk Bakılacak Yer

1. `changelog.md`: Son ne değişti?
2. `todo.md`: Hangi görev üzerinde çalışılıyordu?
3. `lesson.md`: Aynı sorun daha önce yaşandı mı?
4. `decisions.md`: İlgili mimari karar neydi?
5. Git diff ve son başarılı commit
6. Build/lint/typecheck/test çıktıları
7. Migration raporları ve loglar

## Tasarım Kalite Kontrolü

- [ ] Başlıklar tamamen dolu sarı mı?
- [ ] 60–30–10 dengesi korunuyor mu?
- [ ] Inter/Roboto kullanılmıyor mu?
- [ ] Mobil görünüm ayrıca tasarlandı mı?
- [ ] Hamburger menü klavye ile çalışıyor mu?
- [ ] Reduced motion desteği var mı?
- [ ] Kartlar jenerik tekrar hissi veriyor mu?
- [ ] Alt bölümlerde mikro etkileşimler kontrollü mü?
- [ ] Yatay taşma var mı?
- [ ] Görseller uygun boyut ve formatta mı?

## Yayına Alma Öncesi

- [ ] WordPress tam yedeği
- [ ] Staging kabul testi
- [ ] Kaynak/hedef içerik adet kontrolü
- [ ] Redirect doğrulaması
- [ ] Critical URL smoke test
- [ ] Lighthouse raporu
- [ ] Analytics
- [ ] Search Console
- [ ] Sitemap
- [ ] robots.txt
- [ ] 404/500 sayfaları
- [ ] Form testi
- [ ] Rollback planı
