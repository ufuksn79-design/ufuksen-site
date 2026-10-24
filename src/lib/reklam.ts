/**
 * Yazı içi reklam yerleşimi.
 *
 * NEDEN GEREKLİ: yalnızca AdSense yükleyici betiği konulduğunda "otomatik
 * reklamlar" çalışır ve Google yerleşimi kendi seçer — pratikte kenarlara
 * ve sayfa altına koyar, yazının içine koymaz. Yazı içi yerleşim için
 * gövdeye **manuel reklam birimi** yerleştirmek gerekiyor.
 *
 * Birim gövdeye H2 başlıklarının arasına giriyor: okur bir bölümü bitirip
 * diğerine geçerken reklamı görüyor, cümlenin ortasında değil.
 */
import reklam from "../content/reklam.json";

export interface IcerikReklamAyari {
  /** AdSense panelinden alınan birim kimliği. Boşsa hiçbir şey basılmaz. */
  slot: string;
  yayinciId: string;
  /** Kaç birim konacak. */
  adet: number;
  /** İlk birim kaçıncı H2'den sonra gelsin. */
  ilkBaslik: number;
  /** Birimler arasında en az kaç H2 olsun. */
  baslikAraligi: number;
  /** Bu kelime sayısının altındaki yazıya reklam konmaz. */
  enAzKelime: number;
}

export const ICERIK_AYARI: IcerikReklamAyari = {
  slot: reklam.icerikBirimi?.slot ?? "",
  yayinciId: reklam.yayinciId,
  adet: reklam.icerikBirimi?.adet ?? 2,
  ilkBaslik: reklam.icerikBirimi?.ilkBaslik ?? 2,
  baslikAraligi: reklam.icerikBirimi?.baslikAraligi ?? 3,
  enAzKelime: reklam.icerikBirimi?.enAzKelime ?? 400,
};

/** Tek bir reklam biriminin HTML'i. */
function birim(ayar: IcerikReklamAyari): string {
  return [
    '<aside class="reklam-ici" aria-label="Reklam">',
    '<span class="reklam-ici__etiket">Reklam</span>',
    '<ins class="adsbygoogle" style="display:block"',
    ` data-ad-client="${ayar.yayinciId}"`,
    ` data-ad-slot="${ayar.slot}"`,
    ' data-ad-format="fluid"',
    ' data-ad-layout="in-article"></ins>',
    "</aside>",
  ].join("");
}

/** Gövdedeki kelime sayısı — kısa yazıya reklam koymamak için. */
function kelimeSayisi(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Gövdeye yazı içi reklam birimlerini yerleştirir.
 *
 * Birimler kapanış `</h2>` etiketlerinden ÖNCE değil, başlıktan önceki
 * bölümün sonuna — yani bir sonraki `<h2` etiketinin hemen öncesine
 * konuyor. Böylece reklam bir bölümü bölmüyor.
 *
 * Slot boşsa gövde olduğu gibi döner: panelden birim kimliği gelmeden
 * yarım bir `<ins>` basmanın anlamı yok.
 */
export function icerikReklamiEkle(html: string, ayar = ICERIK_AYARI): string {
  if (!reklam.acik) return html;
  if (!ayar.slot) return html;
  if (kelimeSayisi(html) < ayar.enAzKelime) return html;

  /* Gövdedeki tüm <h2 ...> başlangıçlarının konumu */
  const konumlar: number[] = [];
  const kalip = /<h2[\s>]/gi;
  let m: RegExpExecArray | null;
  while ((m = kalip.exec(html)) !== null) konumlar.push(m.index);

  /* İlk başlıktan önce reklam olmaz; en az ilkBaslik kadar H2 gerekiyor. */
  if (konumlar.length <= ayar.ilkBaslik) return html;

  const eklenecek: number[] = [];
  for (let i = ayar.ilkBaslik; i < konumlar.length; i += ayar.baslikAraligi) {
    if (eklenecek.length >= ayar.adet) break;
    eklenecek.push(konumlar[i]);
  }
  if (eklenecek.length === 0) return html;

  /* Sondan başa doğru ekliyoruz ki önceki konumlar kaymasın. */
  let sonuc = html;
  for (const k of [...eklenecek].reverse()) {
    sonuc = sonuc.slice(0, k) + birim(ayar) + sonuc.slice(k);
  }
  return sonuc;
}
