/**
 * Başlık ve meta açıklama düzeltmesi (iç SEO).
 *
 * Denetimin bulduğu sorunlar:
 *   - 31 sayfada başlık 60 karakteri aşıyor (Google kesiyor)
 *   - 16 açıklama 158'i aşıyor, 34 açıklama 70'in altında
 *   - 5 başlık ve 6 açıklama birden fazla sayfada tekrar ediyor
 *
 * Yaklaşım: metin UYDURULMAZ. Açıklama yoksa ya da kısaysa yazının kendi
 * gövdesinden ilk anlamlı cümleler alınır. Başlık uzunsa kuyruktaki
 * tekrar eden kısım atılır, anahtar kelime başta kalır.
 *
 * Yalnızca `seo.title` / `seo.description` alanları yazılır; yazının
 * kendi `title` alanına dokunulmaz (sayfada görünen H1 değişmesin).
 */
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const KURU = process.argv.includes("--kuru");

const BASLIK_EN_COK = 60;
const ACIKLAMA_HEDEF = 155;
const ACIKLAMA_EN_AZ = 70;

const EK = " | Ufuk Şen";

/** Gövdeden düz metin. */
const duz = (html) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Cümle sınırında kırp. */
function kirp(metin, ust) {
  const t = metin.trim();
  if (t.length <= ust) return t;
  const pencere = t.slice(0, ust + 1);
  const nokta = Math.max(pencere.lastIndexOf(". "), pencere.lastIndexOf("! "), pencere.lastIndexOf("? "));
  if (nokta >= Math.floor(ust * 0.55)) return pencere.slice(0, nokta + 1).trim();
  const bosluk = pencere.lastIndexOf(" ");
  return (bosluk > 0 ? pencere.slice(0, bosluk) : pencere).replace(/[ ,;:–-]+$/, "") + "…";
}

/** Gövdeden açıklama üret — uydurma yok, yazının kendi cümleleri. */
function aciklamaUret(kayit) {
  const kaynak = [kayit.excerpt, duz(kayit.contentHtml)].filter(Boolean).join(" ");
  const t = duz(kaynak);
  if (t.length < 40) return null;
  return kirp(t, ACIKLAMA_HEDEF);
}

/**
 * Başlığı 60 karaktere sığdır.
 * Önce " | Ufuk Şen" eki düşünülür; sığmıyorsa başlık gövdesi kırpılır.
 */
function baslikKisalt(ham) {
  const tam = ham + EK;
  if (tam.length <= BASLIK_EN_COK) return null; // sorun yok
  /**
   * Bütçeden 1 karakter daha düşülüyor: `kirp` kelime ortasında kesmek
   * zorunda kaldığında sona "…" ekliyor ve toplam 60'ı 1 karakter aşıyordu.
   */
  const yer = BASLIK_EN_COK - EK.length - 1;
  if (yer < 20) return kirp(ham, BASLIK_EN_COK - 1);
  return kirp(ham, yer) + EK;
}

/* ---------------------------------------------------------------- */
const dosyalar = [];
for (const tur of ["posts", "pages"]) {
  const d = path.join(KOK, "src", "content", tur);
  for (const f of fs.readdirSync(d)) dosyalar.push(path.join(d, f));
}

/* Önce mevcut hâlleri topla — tekrarları bulmak için. */
const kayitlar = dosyalar.map((f) => ({ f, j: JSON.parse(fs.readFileSync(f, "utf8")) }));

const etkinBaslik = (j) => j.seo?.title ?? `${j.title}${EK}`;
const etkinAciklama = (j) => j.seo?.description ?? null;

/** Aynı başlığı taşıyan kayıtlar. */
const baslikSayisi = new Map();
for (const { j } of kayitlar) {
  const b = etkinBaslik(j);
  baslikSayisi.set(b, (baslikSayisi.get(b) ?? 0) + 1);
}
const aciklamaSayisi = new Map();
for (const { j } of kayitlar) {
  const a = etkinAciklama(j);
  if (a) aciklamaSayisi.set(a, (aciklamaSayisi.get(a) ?? 0) + 1);
}

const sayac = { baslikUzun: 0, baslikTekrar: 0, aciklamaYeni: 0, aciklamaUzun: 0, aciklamaTekrar: 0 };
const ornekler = [];

for (const { f, j } of kayitlar) {
  j.seo ??= {};
  let degisti = false;

  /* 1 — Uzun başlık */
  const mevcutBaslik = etkinBaslik(j);
  if (mevcutBaslik.length > BASLIK_EN_COK) {
    const yeni = baslikKisalt(j.seo.title ? j.seo.title.replace(EK, "") : j.title);
    if (yeni && yeni.length < mevcutBaslik.length) {
      ornekler.push(`başlık ${mevcutBaslik.length}→${yeni.length}: ${j.slug}`);
      j.seo.title = yeni;
      sayac.baslikUzun += 1;
      degisti = true;
    }
  }

  /* 2 — Tekrar eden başlık: yılı ya da ayırt edici bir ek koy */
  if (baslikSayisi.get(etkinBaslik(j)) > 1) {
    const yil = (j.publishedAt ?? "").slice(0, 4);
    const govde = (j.seo.title ?? `${j.title}${EK}`).replace(EK, "");
    if (yil && !govde.includes(yil)) {
      const aday = kirp(`${govde} (${yil})`, BASLIK_EN_COK - EK.length) + EK;
      j.seo.title = aday;
      sayac.baslikTekrar += 1;
      degisti = true;
    }
  }

  /* 3 — Açıklama: yok, kısa ya da uzun */
  const a = etkinAciklama(j);
  if (!a || a.length < ACIKLAMA_EN_AZ || a.length > 158) {
    const yeni = aciklamaUret(j);
    if (yeni && yeni.length >= ACIKLAMA_EN_AZ) {
      if (!a) sayac.aciklamaYeni += 1;
      else sayac.aciklamaUzun += 1;
      j.seo.description = yeni;
      degisti = true;
    }
  }

  /* 4 — Tekrar eden açıklama */
  const a2 = etkinAciklama(j);
  if (a2 && aciklamaSayisi.get(a2) > 1) {
    const yeni = aciklamaUret(j);
    if (yeni && yeni !== a2) {
      j.seo.description = yeni;
      sayac.aciklamaTekrar += 1;
      degisti = true;
    }
  }

  if (degisti && !KURU) fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n", "utf8");
}

console.log(KURU ? "KURU ÇALIŞTIRMA — dosya yazılmadı" : "Yazıldı.");
console.log(`  uzun başlık kısaltıldı : ${sayac.baslikUzun}`);
console.log(`  tekrar eden başlık ayrıştırıldı: ${sayac.baslikTekrar}`);
console.log(`  eksik açıklama eklendi : ${sayac.aciklamaYeni}`);
console.log(`  kısa/uzun açıklama düzeltildi: ${sayac.aciklamaUzun}`);
console.log(`  tekrar eden açıklama ayrıştırıldı: ${sayac.aciklamaTekrar}`);
if (ornekler.length) {
  console.log("\n  örnekler:");
  for (const o of ornekler.slice(0, 5)) console.log(`    ${o}`);
}
