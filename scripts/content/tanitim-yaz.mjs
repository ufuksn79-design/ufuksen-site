/**
 * Ürün tanıtım metinlerini ürün kayıtlarına işler (ADR-024).
 *
 * **Metinler mağazadan kopyalanmaz.** Aynı metin iki sitede durursa Google
 * ikisini de yinelenen içerik sayar ve ikisi birden düşer. Buradaki anlatım
 * ufuksen.com'a özgüdür; mağaza kendi metniyle kalır.
 *
 * **Hiçbir olgu uydurulmadı.** Süreler, desen/model sayıları, test sayıları ve
 * uyumluluk `plugin-store/data/plugins.json` ölçümlerinden; eğitmen kanıtı
 * `data/udemy.json` değerlerinden gelir. Anlatım yeniden yazıldı, sayı
 * değiştirilmedi.
 *
 * Yazım biçimi (kullanıcı kuralları):
 *   - Önce kimlik/duygu, sonra somut kanıt, sonra avantaj.
 *   - Uzun kuyruklu ifadeler başlıkta ve ilk paragrafta; doğal yoğunlukta.
 *   - Soru biçimli ara başlıklar; ilişkili kavramlar (SketchUp sürümleri,
 *     V-Ray/Enscape, CSV/DXF) anılır.
 *   - Önce İngilizce (global öncelik), sonra Türkçe.
 *   - Fiyat yok: satın alma mağaza sayfasında.
 *
 * Çalıştırma:  node scripts/content/tanitim-yaz.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
/* Metinler bölümlere ayrıldı: 22 ürün tek dosyada okunmaz hâle geliyordu. */
import { METINLER as B1 } from "./tanitim-metinleri.mjs";
import { METINLER as B2 } from "./tanitim-metinleri-2.mjs";
import { METINLER as B3 } from "./tanitim-metinleri-3.mjs";
import { METINLER as B4 } from "./tanitim-metinleri-4.mjs";

const METINLER = { ...B1, ...B2, ...B3, ...B4 };

const HEDEF = join(resolve("."), "src", "content", "products");

let islenen = 0;
const eksik = [];

for (const [slug, m] of Object.entries(METINLER)) {
  const yol = join(HEDEF, `${slug}.json`);
  let d;
  try {
    d = JSON.parse(await readFile(yol, "utf8"));
  } catch {
    eksik.push(slug);
    continue;
  }

  d.baslik = m.tr.baslik;
  d.sunum = m.tr.sunum;
  d.hikayeler = m.tr.hikayeler;

  d.en.baslik = m.en.baslik;
  d.en.sunum = m.en.sunum;
  d.en.hikayeler = m.en.hikayeler;

  await writeFile(yol, JSON.stringify(d, null, 2) + "\n", "utf8");
  islenen++;
}

console.log(`${islenen} ürüne tanıtım metni yazıldı.`);
if (eksik.length) console.warn("  kaydı bulunamadı:", eksik.join(", "));

/* Hangi ürünlerin metni henüz yazılmadı? */
const { readdir } = await import("node:fs/promises");
const tumu = (await readdir(HEDEF)).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
const yazilmamis = tumu.filter((s) => !METINLER[s]);
if (yazilmamis.length) {
  console.warn(`  metni bekleyen ${yazilmamis.length} ürün: ${yazilmamis.join(", ")}`);
}
