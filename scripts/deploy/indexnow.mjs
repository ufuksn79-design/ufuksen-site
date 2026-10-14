/**
 * IndexNow bildirimi — siteyi Bing, Yandex, Seznam ve Naver'a haber verir.
 *
 * IndexNow'ı Google KULLANMAZ. Google için Search Console'a sitemap verilir;
 * bu betik onun yerine geçmez, yanına eklenir.
 *
 * Nasıl çalışır: `public/<anahtar>.txt` dosyası sitenin kökünde yayındadır ve
 * içinde anahtarın kendisi yazar. Arama motoru bildirimi alınca o dosyayı
 * okuyup anahtarı doğrular; böylece başkası sizin adınıza URL bildiremez.
 *
 * Kullanım:
 *   node scripts/deploy/indexnow.mjs            # sitemap'teki tüm URL'ler
 *   node scripts/deploy/indexnow.mjs --kuru     # göndermeden ne gideceğini yaz
 *   node scripts/deploy/indexnow.mjs /yol.html /baska-yol.html
 *
 * Tek seferde en fazla 10.000 URL gönderilebilir (protokol sınırı).
 */
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const SITE = "https://www.ufuksen.com";
const HOST = "www.ufuksen.com";
const UC_NOKTA = "https://api.indexnow.org/indexnow";

/** Anahtar, public/ altındaki tek satırlık .txt dosyasından okunur. */
function anahtariBul() {
  const dizin = path.join(KOK, "public");
  for (const ad of fs.readdirSync(dizin)) {
    const esle = ad.match(/^([0-9a-f]{8,128})\.txt$/);
    if (!esle) continue;
    const icerik = fs.readFileSync(path.join(dizin, ad), "utf8").trim();
    if (icerik === esle[1]) return { anahtar: esle[1], dosya: ad };
  }
  throw new Error("public/ altında IndexNow anahtar dosyası bulunamadı");
}

/** URL'ler sitemap'ten okunur — elle liste tutulmaz, kaynak tek olsun. */
function sitemaptenUrller() {
  const dizin = path.join(KOK, "dist");
  const indeks = path.join(dizin, "sitemap-index.xml");
  if (!fs.existsSync(indeks)) {
    throw new Error("dist/sitemap-index.xml yok — önce `npm run build` çalıştırın");
  }
  const dosyalar = [...fs.readFileSync(indeks, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .map((u) => path.join(dizin, new URL(u).pathname.replace(/^\//, "")));

  const urller = new Set();
  for (const d of dosyalar) {
    if (!fs.existsSync(d)) continue;
    for (const m of fs.readFileSync(d, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urller.add(m[1]);
    }
  }
  return [...urller];
}

const argv = process.argv.slice(2);
const kuru = argv.includes("--kuru");
const elleVerilen = argv.filter((a) => a.startsWith("/"));

const { anahtar, dosya } = anahtariBul();
const urlList = elleVerilen.length > 0 ? elleVerilen.map((y) => SITE + y) : sitemaptenUrller();

if (urlList.length === 0) throw new Error("gönderilecek URL yok");
if (urlList.length > 10000) throw new Error(`10.000 sınırı aşıldı: ${urlList.length}`);

const govde = {
  host: HOST,
  key: anahtar,
  keyLocation: `${SITE}/${dosya}`,
  urlList,
};

console.log(`anahtar dosyası : ${govde.keyLocation}`);
console.log(`URL sayısı      : ${urlList.length}`);
console.log(`ilk üç          : ${urlList.slice(0, 3).join(", ")}`);

if (kuru) {
  console.log("\n--kuru verildi, gönderilmedi.");
  process.exit(0);
}

/** Anahtar dosyası yayında mı? Değilse bildirim zaten reddedilir. */
const kontrol = await fetch(govde.keyLocation);
const okunan = (await kontrol.text()).trim();
if (!kontrol.ok || okunan !== anahtar) {
  throw new Error(
    `anahtar dosyası doğrulanamadı (${kontrol.status}). Canlıda yayında olduğundan emin olun.`,
  );
}
console.log("anahtar dosyası canlıda doğrulandı.");

const yanit = await fetch(UC_NOKTA, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(govde),
});

const metin = await yanit.text();
console.log(`\nIndexNow yanıtı : ${yanit.status} ${yanit.statusText}`);
if (metin.trim()) console.log(metin.trim());

/**
 * 200 = alındı, 202 = alındı ama anahtar doğrulaması beklemede.
 * İkisi de başarıdır; diğer kodlar hata sayılır ve çıkış kodu 1 olur.
 */
if (yanit.status !== 200 && yanit.status !== 202) {
  console.error("Bildirim kabul edilmedi.");
  process.exit(1);
}
console.log("Bildirim kabul edildi.");
