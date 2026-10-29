/**
 * Eksik görsel alt metinlerini doldurur (iç SEO + erişilebilirlik).
 *
 * WordPress'ten gelen gövdelerde 83 görsel `alt=""` taşıyordu. Boş alt,
 * ekran okuyucu için görseli yok sayar ve görsel aramasında sayfayı
 * görünmez kılar.
 *
 * YAKLAŞIM — metin uydurulmaz, iki kaynaktan türetilir:
 *   1. Dosya adı anlamlıysa ondan ("Blender.jpg" → "Blender").
 *   2. Değilse ("aa.jpg", "043.webp") yazının başlığından.
 * Aynı yazıda birden çok görsel varsa sıra numarası eklenir, böylece
 * aynı alt metni tekrar etmez.
 *
 * Anahtar kelime doldurması YAPILMAZ: alt metni görseli tarif eder,
 * sayfayı sıralatmak için kullanılmaz.
 */
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const KURU = process.argv.includes("--kuru");

/** Dosya adı bilgi taşıyor mu? */
const ANLAMSIZ = /^(img|image|dsc|dscn|photo|untitled|resim|adsiz|[a-z]{1,3}|\d+|[a-z]{1,2}\d+)$/i;

/**
 * Dosya adı artıkları: küçültme eki, ölçü, kopya işareti. Alt metninde
 * "min" ya da "1x" görmek okura hiçbir şey anlatmaz.
 */
const GURULTU = /\b(min|scaled|copy|kopya|final|son|edited|\d+x|e\d{6,})\b/gi;

function dosyaAdindanAlt(src) {
  let ad = decodeURIComponent(path.basename(src))
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s*\d{2,4}x\d{2,4}\s*/g, " ")
    .replace(GURULTU, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!ad || ANLAMSIZ.test(ad.replace(/\s+/g, ""))) return null;
  if (ad.length < 4) return null;

  /**
   * Bitişik yazılmış uzun ad ("3dgorsellestirme") okunabilir değil —
   * başlığa düşüyoruz. Boşluk içeriyorsa ya da kısaysa ("Blender") kullanılır.
   */
  if (!/\s/.test(ad) && ad.length > 12) return null;

  /* Çok uzun dosya adlarını kırp: alt metni cümle değil, etiket. */
  if (ad.length > 70) ad = ad.slice(0, 70).replace(/\s+\S*$/, "");

  return ad.charAt(0).toLocaleUpperCase("tr-TR") + ad.slice(1);
}

/** HTML özniteliği için güvenli hâle getir. */
const kacir = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let toplamGorsel = 0;
let doldurulan = 0;
let dosyaAdindan = 0;
let baslikDan = 0;
const ornekler = [];

for (const tur of ["posts", "pages"]) {
  const dizin = path.join(KOK, "src", "content", tur);
  for (const f of fs.readdirSync(dizin)) {
    const tam = path.join(dizin, f);
    const j = JSON.parse(fs.readFileSync(tam, "utf8"));
    if (!j.contentHtml) continue;

    let sira = 0;
    let degisti = false;

    const yeni = j.contentHtml.replace(/<img\b[^>]*>/gi, (etiket) => {
      toplamGorsel += 1;
      /* Dolu alt varsa dokunma. */
      if (/\balt\s*=\s*"[^"]+"/i.test(etiket)) return etiket;

      const src = (etiket.match(/\bsrc\s*=\s*"([^"]+)"/i) ?? [])[1] ?? "";
      sira += 1;

      let alt = dosyaAdindanAlt(src);
      if (alt) dosyaAdindan += 1;
      else {
        alt = j.title;
        baslikDan += 1;
      }
      /* Aynı yazıda ikinci ve sonraki görsellerde sırayı ekle. */
      if (sira > 1) alt = `${alt} — görsel ${sira}`;

      doldurulan += 1;
      degisti = true;
      if (ornekler.length < 5) ornekler.push(`${j.slug}: "${alt}"`);

      /* Boş alt varsa değiştir, hiç yoksa ekle. */
      return /\balt\s*=\s*"[^"]*"/i.test(etiket)
        ? etiket.replace(/\balt\s*=\s*"[^"]*"/i, `alt="${kacir(alt)}"`)
        : etiket.replace(/<img\b/i, `<img alt="${kacir(alt)}"`);
    });

    if (degisti && !KURU) {
      j.contentHtml = yeni;
      fs.writeFileSync(tam, JSON.stringify(j, null, 2) + "\n", "utf8");
    }
  }
}

console.log(KURU ? "KURU ÇALIŞTIRMA — dosya yazılmadı" : "Yazıldı.");
console.log(`  taranan görsel     : ${toplamGorsel}`);
console.log(`  alt metni dolduruldu: ${doldurulan}`);
console.log(`    dosya adından    : ${dosyaAdindan}`);
console.log(`    yazı başlığından : ${baslikDan}`);
if (ornekler.length) {
  console.log("\n  örnekler:");
  for (const o of ornekler) console.log(`    ${o}`);
}
