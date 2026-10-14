/**
 * ZIP üretimi — kendi yazıcımız (LES-014).
 *
 * **Neden hazır araç kullanılmıyor:** üçü de bu projede başarısız oldu.
 *
 * | Araç | Sorun |
 * |---|---|
 * | PowerShell `Compress-Archive` | Arşive Windows ters bölüsü yazıyor (`eklenti\sayfa.html`). ZIP biçimi düz bölü şart koşar; katı bir çıkarıcı klasör yerine adında ters bölü olan BOZUK dosyalar üretir. |
 * | Windows `bsdtar` | 2392 dosyalık `dist/` üzerinde **segmentation fault**; dosya listesiyle çağrıldığında ise Türkçe adları kodlama uyuşmazlığından bulamıyor. |
 * | Git Bash `tar` (GNU) | Zip üretemez. |
 *
 * Bu yüzden arşiv burada, Node'un yerleşik `zlib`iyle doğrudan yazılıyor:
 * yol ayıracı her zaman `/`, dosya adları UTF-8 bayrağıyla işaretli
 * (Türkçe adlar bozulmaz), çıktı belirleyici ve doğrulanabilir.
 *
 * Sınır: tek dosya ve toplam arşiv 4 GB altında olmalı (ZIP64 yazılmıyor).
 * Ölçüldü: dist ~173 MB, en büyük dosya ~35 MB.
 */

import { createWriteStream, existsSync, rmSync, statSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { deflateRawSync } from "node:zlib";
import { once } from "node:events";

/* ------------------------------------------------------------------ */
/* CRC-32 (ZIP başlıkları için zorunlu)                                */
/* ------------------------------------------------------------------ */

const CRC_TABLOSU = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLOSU[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Tarihi DOS biçimine çevirir (ZIP başlığı bunu ister). */
function dosTarih(d) {
  const yil = Math.max(1980, d.getFullYear());
  return {
    saat: ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff,
    tarih: (((yil - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff,
  };
}

/* ------------------------------------------------------------------ */
/* Arşivleme                                                           */
/* ------------------------------------------------------------------ */

async function dosyalariTopla(kok, dizin = kok, bulunan = []) {
  for (const girdi of await readdir(dizin, { withFileTypes: true })) {
    const tam = join(dizin, girdi.name);
    if (girdi.isDirectory()) await dosyalariTopla(kok, tam, bulunan);
    else if (girdi.isFile()) bulunan.push(tam);
  }
  return bulunan;
}

/**
 * `kaynak` klasörünün İÇERİĞİNİ `hedef` zip dosyasına yazar.
 *
 * Klasörün kendisi arşivlenmez: açılınca dosyalar doğrudan hedef dizine düşer,
 * araya fazladan bir klasör girmez.
 */
export async function zipKlasor(kaynak, hedef) {
  if (!existsSync(kaynak)) throw new Error(`Paketlenecek klasör yok: ${kaynak}`);
  if (existsSync(hedef)) rmSync(hedef);

  const dosyalar = (await dosyalariTopla(kaynak)).sort();
  if (dosyalar.length === 0) throw new Error(`Klasör boş: ${kaynak}`);

  const cikti = createWriteStream(hedef);
  const merkez = [];
  let konum = 0;

  /** Geri basınç: akış doluysa boşalmasını bekle — 2400 dosyada bellek şişmesin. */
  const yaz = async (buf) => {
    if (!cikti.write(buf)) await once(cikti, "drain");
    konum += buf.length;
  };

  for (const yol of dosyalar) {
    // Yol ayıracı HER ZAMAN "/" — ZIP biçiminin şartı ve Linux sunucunun beklentisi
    const ad = relative(kaynak, yol).split(sep).join("/");
    const adBuf = Buffer.from(ad, "utf8");
    const ham = readFileSync(yol);
    const sikisik = deflateRawSync(ham, { level: 9 });

    // Sıkıştırma büyütüyorsa dosyayı olduğu gibi sakla (method 0)
    const sikistir = sikisik.length < ham.length;
    const veri = sikistir ? sikisik : ham;
    const yontem = sikistir ? 8 : 0;

    const crc = crc32(ham);
    const { saat, tarih } = dosTarih(statSync(yol).mtime);
    const yerelKonum = konum;

    const yerel = Buffer.alloc(30);
    yerel.writeUInt32LE(0x04034b50, 0);
    yerel.writeUInt16LE(20, 4); // gereken sürüm
    yerel.writeUInt16LE(0x0800, 6); // bayrak: dosya adı UTF-8
    yerel.writeUInt16LE(yontem, 8);
    yerel.writeUInt16LE(saat, 10);
    yerel.writeUInt16LE(tarih, 12);
    yerel.writeUInt32LE(crc, 14);
    yerel.writeUInt32LE(veri.length, 18);
    yerel.writeUInt32LE(ham.length, 22);
    yerel.writeUInt16LE(adBuf.length, 26);
    yerel.writeUInt16LE(0, 28);

    await yaz(yerel);
    await yaz(adBuf);
    await yaz(veri);

    const kayit = Buffer.alloc(46);
    kayit.writeUInt32LE(0x02014b50, 0);
    kayit.writeUInt16LE(20, 4); // üreten sürüm
    kayit.writeUInt16LE(20, 6);
    kayit.writeUInt16LE(0x0800, 8);
    kayit.writeUInt16LE(yontem, 10);
    kayit.writeUInt16LE(saat, 12);
    kayit.writeUInt16LE(tarih, 14);
    kayit.writeUInt32LE(crc, 16);
    kayit.writeUInt32LE(veri.length, 20);
    kayit.writeUInt32LE(ham.length, 24);
    kayit.writeUInt16LE(adBuf.length, 28);
    kayit.writeUInt32LE(yerelKonum, 42);
    merkez.push(Buffer.concat([kayit, adBuf]));
  }

  const merkezBaslangic = konum;
  for (const k of merkez) await yaz(k);
  const merkezBoyut = konum - merkezBaslangic;

  const son = Buffer.alloc(22);
  son.writeUInt32LE(0x06054b50, 0);
  son.writeUInt16LE(merkez.length, 8);
  son.writeUInt16LE(merkez.length, 10);
  son.writeUInt32LE(merkezBoyut, 12);
  son.writeUInt32LE(merkezBaslangic, 16);
  await yaz(son);

  cikti.end();
  await once(cikti, "close");

  dogrula(hedef, dosyalar.length);
  return { boyut: statSync(hedef).size, adet: dosyalar.length };
}

/**
 * Üretilen arşivi okuyup doğrular.
 *
 * Sessizce eksik ya da bozuk paket üretmektense derlemeyi durdurmak yeğdir:
 * bozuk zip ancak sunucuda açıldıktan sonra fark edilirdi. Daha önce tam da
 * bu oldu — 2392 dosyanın 1397'si pakete girmişti.
 */
function dogrula(zipYolu, beklenenAdet) {
  const buf = readFileSync(zipYolu);

  // Arşiv sonu kaydını (EOCD) sondan ara
  let son = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 65557; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      son = i;
      break;
    }
  }
  if (son < 0) throw new Error("Arşiv sonu kaydı bulunamadı; paket bozuk.");

  const adet = buf.readUInt16LE(son + 10);
  if (adet !== beklenenAdet) {
    throw new Error(`Pakette ${adet} dosya var, beklenen ${beklenenAdet}. Paket eksik.`);
  }

  // Merkezî dizini gezip her adın düz bölü taşıdığını doğrula
  let p = buf.readUInt32LE(son + 16);
  for (let i = 0; i < adet; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("Merkezî dizin kaydı bozuk.");
    const adUz = buf.readUInt16LE(p + 28);
    const ekUz = buf.readUInt16LE(p + 30);
    const yorumUz = buf.readUInt16LE(p + 32);
    const ad = buf.toString("utf8", p + 46, p + 46 + adUz);
    if (ad.includes("\\")) {
      throw new Error(`Arşivde ters bölü var: ${ad}. Linux sunucuda klasör oluşmaz.`);
    }
    p += 46 + adUz + ekUz + yorumUz;
  }
}

/** Boyutu okunur biçimde yazdırır. */
export function mbYaz(etiket, bayt) {
  console.log(`${etiket} (${(bayt / 1024 / 1024).toFixed(1)} MB)`);
}
