/**
 * Udemy eğitim seti verisini üretir ve kapak görsellerini indirir.
 *
 * KAYNAK: https://www.udemy.com/user/ufuksen/ — eğitmen profilinin dört
 * sayfası tarayıcıdan okundu (2026-10-15). Puan, yorum sayısı, süre, ders
 * sayısı ve seviye orada yazdığı gibi alındı; hiçbiri tahmin değil.
 *
 * FİYAT TUTULMUYOR: Udemy fiyatları kampanyaya göre sürekli değişir, sabit
 * yazmak kısa sürede yanlış bilgi üretir (eski karardan devam).
 *
 * Profil üstündeki toplamlar: 7.273 öğrenci, 900 yorum.
 *
 * Kullanım: node scripts/content/udemy-kurslari.mjs
 */
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const GORSEL_DIZIN = path.join(KOK, "public", "media", "udemy");

/**
 * Dil elle yazıldı, kalıpla tahmin edilmedi: "SketchUp" kelimesi Türkçe
 * başlıklarda da geçtiği için kalıp güvenilir olmuyordu.
 */
const KURSLAR = [
  ["d5-render-mimari-gorsellestirme-egitim-seti", "D5 Render Mimari Görselleştirme Eğitim Seti", 4.3, 149, 3, 16, "Yeni Başlayan", "tr", "5299256_cf1f_4"],
  ["d5-render-29-ile-gercekci-yatak-odas-render-egitimi", "D5 Render 2.9 ile Gerçekçi Yatak Odası Render Eğitimi", 4.5, 8, 3, 37, "Tüm Düzeyler", "tr", "6487497_4fd9"],
  ["realistic-bedroom-rendering-with-enscape-42", "Realistic Bedroom Rendering with Enscape 4.2", 4.3, 5, 3.5, 34, "Tüm Düzeyler", "en", "6571835_3916"],
  ["d5-render-motoru-ile-gercekci-kaliteli-ic-mekan-render", "D5 Render Motoru ile Gerçekçi Kaliteli İç Mekân Render", 4.1, 55, 1.5, 10, "Yeni Başlayan", "tr", "4529158_57a5_3"],
  ["sketchup-2023-en-iyi-temel-egitim-kursu-01", "SketchUp 2023 En İyi Temel Eğitim Kursu 01", 4.3, 65, 2, 11, "Yeni Başlayan", "tr", "5646210_3762_4"],
  ["sketchup-icin-en-iyi-pluginler-is-aksn-hzlandr", "SketchUp için En İyi Pluginler: İş Akışını Hızlandır", 4.7, 15, 2.5, 41, "Tüm Düzeyler", "tr", "6466471_bd64_2"],
  ["sketchup-2023-en-iyi-temel-egitim-kursu-02", "SketchUp 2023 En İyi Temel Eğitim Kursu 02", 4.3, 19, 2, 8, "Yeni Başlayan", "tr", "5649588_f952_5"],
  ["twinmotion-2025-masterclass-from-zero-to-expert", "Twinmotion 2025 Masterclass: From Zero to Expert", 3.9, 7, 6, 40, "Tüm Düzeyler", "en", "6574117_4b00"],
  ["fast-realistic-rendering-sketchup-to-d5-render-workflow", "Fast & Realistic Rendering: SketchUp to D5 Render Workflow", 3.8, 17, 3.5, 36, "Tüm Düzeyler", "en", "6541211_0693_2"],
  ["sketchup-vray-6-gercekci-ic-mekan-render-egitimi", "SketchUp V-Ray 6 Gerçekçi İç Mekân Render Eğitimi", 4.5, 47, 3, 27, "Tüm Düzeyler", "tr", "5877850_a195_2"],
  ["twinmotion-2023-gercekci-render-egitim-seti", "Twinmotion 2023 Gerçekçi Render Eğitim Seti", 4.6, 51, 4, 17, "Yeni Başlayan", "tr", "5284946_af06_3"],
  ["enscape-35-gercekci-3d-gorsellestirme-egitim-seti", "Enscape 3.5 — Gerçekçi 3D Görselleştirme Eğitim Seti", 4.6, 22, 3, 23, "Yeni Başlayan", "tr", "5628621_9794_3"],
  ["d5-render-gercekci-mutfak-egitim-seti", "D5 Render Gerçekçi Mutfak Eğitim Seti", 4.3, 41, 2, 16, "Yeni Başlayan", "tr", "5036632_6378_3"],
  ["sketchup-vray-51-gercekci-gorsel-egitim-seti", "SketchUp V-Ray 5.1 Gerçekçi Görsel Eğitim Seti", 4.3, 92, 1.5, 5, "Tüm Düzeyler", "tr", "4510760_7f03_3"],
  ["enscape-render-ile-ust-kalite-gercekci-salon-render-egitimi", "Enscape Render — Üst Kalite İç Mekân Görselleştirme Eğitimi", 4.2, 61, 1, 8, "Tüm Düzeyler", "tr", "4514914_a012"],
  ["corona-render-kaliteli-gorsellestirme-mutfak-egitim-seti", "Corona Render Kaliteli Görselleştirme Mutfak Eğitim Seti", 4.2, 15, 3.5, 16, "Yeni Başlayan", "tr", "4515908_8749"],
  ["enscape-render-33-ile-gercekci-3d-gorsellestirme", "Enscape Render 3.3 ile Gerçekçi 3D Görselleştirme", 4.2, 10, 5, 27, "Yeni Başlayan", "tr", "4927410_c53a"],
  ["enscape-render-kaliteli-ve-gercekci-gorsellestirme-egitimi", "Enscape Render Kaliteli ve Gerçekçi Görselleştirme Eğitimi", 3.6, 19, 2, 11, "Yeni Başlayan", "tr", "4316398_7d89_2"],
  ["unreal-engine-51-en-iyi-ucretsiz-icerik-kursu-bolum-01", "Unreal Engine 5.1 En İyi İçerik Kursu", 4.7, 102, 1.5, 12, "Yeni Başlayan", "tr", "5029950_858f_5"],
  ["render-interior-realista-con-enscape-42-dormitorio-paso", "Render Interior Realista con Enscape 4.2: Dormitorio Paso a Paso", 4.5, 1, 4, 37, "Tüm Düzeyler", "es", "6572283_ca6d"],
  ["photorealistic-exterior-rendering-in-twinmotion-2025", "Photorealistic Exterior Rendering in Twinmotion 2025", null, 0, 3.5, 22, "Tüm Düzeyler", "en", "6563695_6da9"],
  ["master-architectural-rendering-sketchup-v-ray-course", "Master Architectural Rendering: SketchUp & V-Ray Course", 3.9, 3, 3, 26, "Tüm Düzeyler", "en", "6553945_4f06"],
  ["sketchup-power-tools-must-have-plugins-for-faster-modeling", "SketchUp Best Plugins: Must-Have Plugins for Faster Modeling", 4.5, 2, 2.5, 37, "Tüm Düzeyler", "en", "6538817_0518_3"],
  ["effektives-und-schnelles-rendern-mit-sketchup-und-v-ray-7", "Effektives und schnelles Rendern mit SketchUp und V-Ray 7", null, 0, 1.5, 23, "Tüm Düzeyler", "de", "6534493_7015"],
  ["realistic-interior-rendering-with-sketchup-vray-7", "Realistic Interior Rendering with SketchUp V-Ray 7", 4.5, 15, 1.5, 24, "Tüm Düzeyler", "en", "6517999_024b"],
  ["sketchup-vray-7-hzl-ve-profesyonel-salon-render-egitimi", "SketchUp V-Ray 7: Hızlı ve Profesyonel Salon Render Eğitimi", 4.6, 5, 1.5, 25, "Tüm Düzeyler", "tr", "6515941_de2b_2"],
  ["twinmotion-2025-ile-sinematik-render-baslangctan-uzmanlga", "Twinmotion 2025 ile Sinematik Render: Başlangıçtan Uzmanlığa", 3.8, 6, 1.5, 19, "Tüm Düzeyler", "tr", "6501807_52e5"],
  ["twinmotion-2025-create-cinematic-renders", "Twinmotion 2025: Create Cinematic Renders", 4.2, 2, 1.5, 19, "Tüm Düzeyler", "en", "6501751_f2e8"],
  ["mimari-gorsellestirmede-ustalk-enscape-ile-gercekci-render", "Enscape Render Son Sürüm ile Gerçekçi Render", 4.5, 17, 4, 41, "Tüm Düzeyler", "tr", "6481699_c999_5"],
  ["twinmotion-2025-ile-ic-mekan-yatak-odas-gercekci-render-al", "Twinmotion 2025 ile İç Mekân Yatak Odası Gerçekçi Render Al", null, 0, 2.5, 24, "Tüm Düzeyler", "tr", "6402245_f6f8_3"],
  ["corona-render-ile-sketchup-model-gercekci-render", "Corona Render ile SketchUp Model Gerçekçi Render", 4.3, 2, 1, 11, "Tüm Düzeyler", "tr", "6396349_c272_3"],
  ["twinmotion-2025-ile-gercekci-ds-mekan-olusturun", "Twinmotion 2025 ile Gerçekçi Dış Mekân Oluşturun", 4.4, 42, 3.5, 24, "Tüm Düzeyler", "tr", "6356629_0648_2"],
  ["sketchup-vray-ile-fotogercekci-render", "SketchUp V-Ray ile Fotogerçekçi Render", 4.3, 5, 2.5, 29, "Tüm Düzeyler", "tr", "6212049_af7d_2"],
  ["yapay-zeka-ile-guclendirilmis-enscape-render-gorsellestirme", "Yapay Zekâ ile Güçlendirilmiş Enscape Render Görselleştirme", 4, 1, 1.5, 14, "Tüm Düzeyler", "tr", "6006644_6e00_3"],
];

/** Başlıktan yazılım etiketi — `src/lib/discover.ts` içindeki slug'larla aynı. */
function yazilimlari(baslik) {
  const t = baslik.toLowerCase();
  const bulunan = [];
  if (/sketchup/.test(t)) bulunan.push("sketchup");
  if (/\bd5\b/.test(t)) bulunan.push("d5-render");
  if (/enscape/.test(t)) bulunan.push("enscape");
  if (/twinmotion/.test(t)) bulunan.push("twinmotion");
  if (/v-?ray/.test(t)) bulunan.push("vray");
  if (/corona/.test(t)) bulunan.push("corona");
  if (/unreal/.test(t)) bulunan.push("unreal-engine");
  return bulunan;
}

const kurslar = KURSLAR.map(([slug, baslik, puan, yorum, saat, ders, seviye, dil, gorselId]) => ({
  slug,
  baslik,
  altBaslik: null,
  url: `https://www.udemy.com/course/${slug}/`,
  gorsel: `/media/udemy/${slug}.jpg`,
  gorselKaynak: `https://img-c.udemycdn.com/course/480x270/${gorselId}.jpg`,
  puan,
  yorumSayisi: yorum,
  saat,
  dersSayisi: ders,
  seviye,
  dil,
  yazilim: yazilimlari(baslik),
}));

/* ---------------------------------------------------------------- */
/* Kapak görselleri                                                  */
/* ---------------------------------------------------------------- */
fs.mkdirSync(GORSEL_DIZIN, { recursive: true });

let indirilen = 0;
let mevcut = 0;
const hatalar = [];

for (const k of kurslar) {
  const hedef = path.join(GORSEL_DIZIN, `${k.slug}.jpg`);
  if (fs.existsSync(hedef) && fs.statSync(hedef).size > 2000) {
    mevcut += 1;
    continue;
  }
  try {
    const yanit = await fetch(k.gorselKaynak);
    if (!yanit.ok) throw new Error(`HTTP ${yanit.status}`);
    const buf = Buffer.from(await yanit.arrayBuffer());
    if (buf.length < 2000) throw new Error(`çok küçük: ${buf.length} bayt`);
    fs.writeFileSync(hedef, buf);
    indirilen += 1;
  } catch (hata) {
    hatalar.push(`${k.slug}: ${hata.message}`);
  }
}

/* ---------------------------------------------------------------- */
/* Yazma                                                             */
/* ---------------------------------------------------------------- */
const diller = {};
for (const k of kurslar) diller[k.dil] = (diller[k.dil] ?? 0) + 1;

const cikti = {
  kaynak: "https://www.udemy.com/user/ufuksen/",
  cekilmeTarihi: "2026-10-15",
  toplamOgrenci: 7273,
  toplamYorum: 900,
  not:
    "Eğitmen profilinin dört sayfası tarayıcıdan okundu. FİYAT BİLİNÇLİ OLARAK TUTULMUYOR: " +
    "Udemy fiyatları kampanyaya göre sürekli değişir; sabit yazmak yanlış bilgi üretir. " +
    "Puanı olmayan kurslar yeni yayımlananlardır (henüz yorum almamış).",
  kurslar,
};

fs.writeFileSync(path.join(KOK, "src", "content", "courses.json"), JSON.stringify(cikti, null, 2) + "\n", "utf8");

console.log(`kurs          : ${kurslar.length}`);
console.log(`dil dağılımı  : ${Object.entries(diller).map(([d, n]) => `${d}:${n}`).join(", ")}`);
console.log(`görsel indi   : ${indirilen} (zaten vardı: ${mevcut})`);
if (hatalar.length) console.log(`HATA          : ${hatalar.join(" | ")}`);
console.log(`yazılım dağılımı:`);
const yz = {};
for (const k of kurslar) for (const y of k.yazilim) yz[y] = (yz[y] ?? 0) + 1;
for (const [y, n] of Object.entries(yz).sort((a, b) => b[1] - a[1])) console.log(`  ${y.padEnd(16)} ${n}`);
