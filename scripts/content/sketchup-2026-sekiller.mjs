/**
 * "SketchUp 2026 Profesyonel Eğitim" yazısının grafikleri.
 *
 * NEDEN 560 BİRİM GENİŞLİK: yazı gövdesi `--measure: 68ch` ile sınırlı ve
 * ölçüldüğünde 499px çıkıyor; daha geniş bir viewBox küçültülünce yazılar
 * okunmaz hâle geliyordu (960 birimde 14px'lik yazı ekranda 7px'e düşüyordu).
 * Bu yüzden şekiller dar ve uzun kuruldu — telefonda da aynı yerleşim çalışır.
 *
 * Şekiller ekran görüntüsü taklidi değildir; arayüz şeması açıkça öyle
 * etiketlenmiştir (AGENTS.md §5).
 */

export const R = {
  zemin: "#17171b",
  yuzey: "#1e1e23",
  yuzeyUst: "#26262c",
  cizgi: "#3a3a43",
  metin: "#f2f2f4",
  solgun: "#9a9aa6",
  sari: "#ffd400",
  yesil: "#4ade80",
  mavi: "#38bdf8",
  pembe: "#f472b6",
  turuncu: "#fb923c",
  mor: "#a78bfa",
};

const F = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const W = 560;

function svg(yukseklik, icerik, baslik) {
  /**
   * width/height KÖKE YAZILIR: dosya <img src> ile gömüldüğü için doğal
   * boyutu buradan okunuyor. Daha önce yalnızca viewBox + style vardı ve
   * tarayıcı doğal genişliği 196px sanıyordu; büyüteç şekli küçük açıyordu.
   * Zemin de CSS yerine <rect> ile boyanıyor — <img> içinde CSS zemini
   * dışarıdan değil, dosyanın kendisinden gelmeli.
   */
  return `<svg viewBox="0 0 ${W} ${yukseklik}" width="${W}" height="${yukseklik}" role="img" xmlns="http://www.w3.org/2000/svg"><title>${baslik}</title><rect width="${W}" height="${yukseklik}" fill="${R.zemin}"/>${icerik}</svg>`;
}

function baslikBloku(ust, alt) {
  return `<text x="16" y="30" font-family="${F}" font-size="19" font-weight="800" fill="${R.metin}">${ust}</text>
  <text x="16" y="52" font-family="${F}" font-size="12.5" fill="${R.solgun}">${alt}</text>`;
}

/* ------------------------------------------------------------------ */
/* 1 — SketchUp 2026 yenilikleri                                       */
/* ------------------------------------------------------------------ */
function yenilikKart(x, y, renk, ad, satirlar) {
  return `<g>
    <rect x="${x}" y="${y}" width="262" height="118" rx="10" fill="${R.yuzey}" stroke="${R.cizgi}"/>
    <rect x="${x}" y="${y}" width="4" height="118" rx="2" fill="${renk}"/>
    <text x="${x + 14}" y="${y + 25}" font-family="${F}" font-size="15" font-weight="700" fill="${renk}">${ad}</text>
    ${satirlar.map((s, i) => `<text x="${x + 14}" y="${y + 50 + i * 18}" font-family="${F}" font-size="12.5" fill="${R.solgun}">${s}</text>`).join("")}
  </g>`;
}

export const sekilYenilikler = svg(
  490,
  `${baslikBloku("SketchUp 2026.0 neler getirdi?", "Resmî sürüm notları · 7 Ekim 2025 · yapı 26.0.429 (Win) / 26.0.428 (Mac)")}
  ${yenilikKart(16, 68, R.mavi, "Ortak çalışma", ["Collaboration Bar", "Özel davet ya da genel bağlantı", "3B yorum işaretçileri", "Hide Cursor"])}
  ${yenilikKart(290, 68, R.pembe, "Görselleştirme", ["Ambient Occlusion'a", "Distance Multiplier + renk", "Invert Roughness", "Malzeme küçük resmi seçimi"])}
  ${yenilikKart(16, 198, R.yesil, "Başarım", ["Model açmada bellek kazancı", "Zoom Extents ~%90 hızlı*", "Sahne geçişi ~%86 daha akıcı*", "Etiket temizliği hızlandı"])}
  ${yenilikKart(290, 198, R.turuncu, "Modelleme", ["Live Components için", "ölçek aracında tutamaçlar", "Sahne değişikliğinde geri al", "Etkinleştirmeleri sıfırlama"])}
  ${yenilikKart(16, 328, R.mor, "LayOut", ["Trim · Extend", "Fillet · Chamfer", "Architecture Scrapbook", "Windows arayüzü yenilendi"])}
  ${yenilikKart(290, 328, R.sari, "Veri alışverişi", ["DWG'de tarama (hatch)", "3B DWG'de kesit düzlemi", "IFC tek dosya türünde", "Scan Essentials: 2 yeni araç"])}
  <text x="16" y="470" font-family="${F}" font-size="11.5" fill="${R.solgun}">* Hız rakamları Trimble'ın kendi iç ölçümlerinden; bağımsız olarak doğrulanmadı.</text>`,
  "SketchUp 2026.0 sürüm notlarındaki yenilikler, konu alanlarına göre",
);

/* ------------------------------------------------------------------ */
/* 2 — Sistem gereksinimleri                                           */
/* ------------------------------------------------------------------ */
function gereksinimSatiri(x, y, renk, etiket, deger) {
  return `<g>
    <circle cx="${x + 5}" cy="${y - 10}" r="4" fill="${renk}"/>
    <text x="${x + 18}" y="${y - 6}" font-family="${F}" font-size="11.5" fill="${R.solgun}">${etiket}</text>
    <text x="${x + 18}" y="${y + 10}" font-family="${F}" font-size="13" font-weight="700" fill="${R.metin}">${deger}</text>
  </g>`;
}

function gereksinimPaneli(y, renk, renk2, ad, sol, sag) {
  return `<g>
    <rect x="16" y="${y}" width="528" height="196" rx="12" fill="${R.yuzey}" stroke="${R.cizgi}"/>
    <rect x="16" y="${y}" width="528" height="34" rx="12" fill="${R.yuzeyUst}"/>
    <text x="32" y="${y + 23}" font-family="${F}" font-size="15" font-weight="700" fill="${renk}">${ad}</text>
    ${sol.map(([e, d], i) => gereksinimSatiri(30, y + 72 + i * 38, renk, e, d)).join("")}
    ${sag.map(([e, d], i) => gereksinimSatiri(292, y + 72 + i * 38, renk2, e, d)).join("")}
  </g>`;
}

export const sekilGereksinim = svg(
  540,
  `${baslikBloku("SketchUp 2026 sistem gereksinimleri", "Kaynak: SketchUp'ın resmî sistem gereksinimleri sayfası")}
  ${gereksinimPaneli(
    68,
    R.mavi,
    R.yesil,
    "Windows",
    [
      ["İşletim sistemi", "Windows 11"],
      ["İşlemci", "2 GHz ve üzeri önerilir"],
      ["Ekran kartı", "Ayrı kart, en az 8 GB VRAM"],
    ],
    [
      ["Bellek / disk", "8 GB RAM · 6 GB boş alan"],
      ["Klasik motor", "OpenGL 3.1"],
      ["Yeni motor", "DirectX 12, düzey 11.0"],
    ],
  )}
  ${gereksinimPaneli(
    280,
    R.mor,
    R.turuncu,
    "macOS",
    [
      ["İşletim sistemi", "macOS 26, 15 ve 14"],
      ["İşlemci", "2,1 GHz ya da Apple M1"],
      ["Ekran kartı", "En az 1 GB bellekli GPU"],
    ],
    [
      ["Bellek / disk", "8 GB RAM · 6 GB boş alan"],
      ["Klasik motor", "OpenGL 3.1"],
      ["Yeni motor", "Metal 2"],
    ],
  )}
  <text x="16" y="500" font-family="${F}" font-size="12" fill="${R.sari}">PBR doku, Ambient Occlusion ve IBL ile çalışacaksanız Windows'ta 32 GB VRAM öneriliyor.</text>
  <text x="16" y="520" font-family="${F}" font-size="12" fill="${R.solgun}">Cihaz yeni motorun koşullarını karşılamazsa SketchUp kendiliğinden klasik motora düşer.</text>`,
  "SketchUp 2026 için Windows ve macOS sistem gereksinimleri",
);

/* ------------------------------------------------------------------ */
/* 3 — Arayüz şeması                                                   */
/* ------------------------------------------------------------------ */
function balon(x, y, n, renk) {
  return `<g><circle cx="${x}" cy="${y}" r="11" fill="${renk}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-family="${F}" font-size="12" font-weight="800" fill="${R.zemin}">${n}</text></g>`;
}

const trayAdlari = ["Varlık Bilgisi", "Malzemeler", "Bileşenler", "Etiketler", "Sahneler", "Gölgeler", "Eklenti panelleri"];

export const sekilArayuz = svg(
  470,
  `${baslikBloku("SketchUp 2026 arayüzü — şematik yerleşim", "Bu bir ekran görüntüsü değil; panellerin nerede durduğunu gösteren çizimdir.")}

  <rect x="16" y="68" width="528" height="252" rx="10" fill="${R.yuzey}" stroke="${R.cizgi}"/>
  <rect x="16" y="68" width="528" height="24" rx="10" fill="${R.yuzeyUst}"/>
  <circle cx="30" cy="80" r="3.5" fill="${R.pembe}"/><circle cx="42" cy="80" r="3.5" fill="${R.sari}"/><circle cx="54" cy="80" r="3.5" fill="${R.yesil}"/>
  <text x="68" y="84" font-family="${F}" font-size="10" fill="${R.solgun}">Dosya · Düzen · Görünüm · Kamera · Çizim · Araçlar · Pencere · Uzantılar · Yardım</text>

  <rect x="26" y="102" width="34" height="186" rx="7" fill="${R.yuzeyUst}" stroke="${R.cizgi}"/>
  ${[R.sari, R.mavi, R.yesil, R.turuncu, R.pembe, R.mor].map((c, i) => `<rect x="35" y="${110 + i * 29}" width="16" height="16" rx="4" fill="${c}" opacity="0.85"/>`).join("")}

  <rect x="68" y="102" width="322" height="186" rx="7" fill="#101014" stroke="${R.cizgi}"/>
  <line x1="68" y1="252" x2="390" y2="252" stroke="${R.cizgi}"/>
  <polygon points="150,152 240,132 300,166 300,230 150,230" fill="${R.yuzeyUst}" stroke="${R.sari}" stroke-width="1.8"/>
  <polygon points="150,152 240,132 240,196 150,230" fill="${R.sari}" opacity="0.14"/>
  <line x1="240" y1="132" x2="240" y2="196" stroke="${R.sari}" stroke-width="1.2" opacity="0.7"/>
  <line x1="150" y1="230" x2="240" y2="196" stroke="${R.sari}" stroke-width="1.2" opacity="0.7"/>
  <line x1="240" y1="196" x2="300" y2="230" stroke="${R.sari}" stroke-width="1.2" opacity="0.7"/>
  <line x1="92" y1="252" x2="366" y2="252" stroke="${R.mavi}" stroke-width="1" opacity="0.45" stroke-dasharray="5 5"/>
  <line x1="222" y1="112" x2="222" y2="280" stroke="${R.yesil}" stroke-width="1" opacity="0.3" stroke-dasharray="5 5"/>

  <rect x="398" y="102" width="136" height="186" rx="7" fill="${R.yuzeyUst}" stroke="${R.cizgi}"/>
  ${trayAdlari
    .map(
      (ad, i) =>
        `<g><rect x="406" y="${108 + i * 26}" width="120" height="20" rx="5" fill="${R.yuzey}" stroke="${R.cizgi}"/><text x="415" y="${122 + i * 26}" font-family="${F}" font-size="10" fill="${i === 6 ? R.sari : R.solgun}">${ad}</text></g>`,
    )
    .join("")}

  <rect x="16" y="296" width="528" height="24" fill="${R.yuzeyUst}"/>
  <text x="46" y="312" font-family="${F}" font-size="10" fill="${R.solgun}">İtme/Çekme: Bir yüz seçin ya da ölçü girin</text>
  <rect x="396" y="301" width="118" height="15" rx="3" fill="${R.yuzey}" stroke="${R.yesil}" stroke-opacity="0.6"/>
  <text x="455" y="312" text-anchor="middle" font-family="${F}" font-size="9.5" fill="${R.metin}">3000 mm</text>
  ${balon(33, 98, 1, R.sari)}
  ${balon(76, 98, 2, R.mavi)}
  ${balon(406, 98, 3, R.pembe)}
  ${balon(384, 308, 4, R.yesil)}
  ${balon(30, 308, 5, R.turuncu)}

  <text x="16" y="352" font-family="${F}" font-size="13" fill="${R.metin}"><tspan fill="${R.sari}" font-weight="800">1</tspan>  Araç çubuğu — çizim ve düzenleme araçları.</text>
  <text x="16" y="376" font-family="${F}" font-size="13" fill="${R.metin}"><tspan fill="${R.mavi}" font-weight="800">2</tspan>  Çizim alanı — eksenler, çıkarım çizgileri ve model.</text>
  <text x="16" y="400" font-family="${F}" font-size="13" fill="${R.metin}"><tspan fill="${R.pembe}" font-weight="800">3</tspan>  Tepsiler — malzeme, bileşen, etiket, sahne ve eklenti panelleri.</text>
  <text x="16" y="424" font-family="${F}" font-size="13" fill="${R.metin}"><tspan fill="${R.yesil}" font-weight="800">4</tspan>  Ölçü kutusu — sayıyı yazıp Enter'a basarsınız.</text>
  <text x="16" y="448" font-family="${F}" font-size="13" fill="${R.metin}"><tspan fill="${R.turuncu}" font-weight="800">5</tspan>  Durum çubuğu — aracın o an ne beklediğini söyler.</text>`,
  "SketchUp 2026 arayüzünün şematik yerleşimi",
);

/* ------------------------------------------------------------------ */
/* 4 — Eklenti kurmanın üç yolu                                        */
/* ------------------------------------------------------------------ */
function kurulumAdimi(y, renk, no, ad, satirlar) {
  return `<g>
    <rect x="16" y="${y}" width="528" height="90" rx="10" fill="${R.yuzey}" stroke="${renk}" stroke-opacity="0.45"/>
    <circle cx="48" cy="${y + 45}" r="18" fill="${renk}"/>
    <text x="48" y="${y + 51}" text-anchor="middle" font-family="${F}" font-size="17" font-weight="800" fill="${R.zemin}">${no}</text>
    <text x="82" y="${y + 32}" font-family="${F}" font-size="15" font-weight="700" fill="${R.metin}">${ad}</text>
    ${satirlar.map((s, i) => `<text x="82" y="${y + 54 + i * 17}" font-family="${F}" font-size="12.5" fill="${R.solgun}">${s}</text>`).join("")}
  </g>`;
}

export const sekilEklenti = svg(
  410,
  `${baslikBloku("SketchUp'a eklenti kurmanın üç yolu", "Hangisini kullanırsanız kullanın, kurulumdan sonra SketchUp'ı yeniden başlatın.")}
  ${kurulumAdimi(68, R.mavi, 1, "Extension Warehouse", ["Uzantılar menüsünden mağazayı açın, eklentiyi bulun, Install deyin.", "Güncellemeler de buradan gelir; SketchUp hesabı gerekir."])}
  ${kurulumAdimi(176, R.yesil, 2, "Extension Manager ile .rbz", ["Uzantılar → Extension Manager → Install Extension.", "Satın aldığınız eklentilerin standart kurulum yolu."])}
  ${kurulumAdimi(284, R.turuncu, 3, "Plugins klasörüne elle", ["SketchUp kapalıyken .rbz'yi zip gibi açıp içindekileri kopyalayın.", "Dosyası büyük eklentilerde bu yol daha güvenli."])}
  <text x="16" y="394" font-family="${F}" font-size="11.5" fill="${R.sari}">Windows'ta klasör: %APPDATA%\\SketchUp\\SketchUp 2026\\SketchUp\\Plugins</text>`,
  "SketchUp'a eklenti kurmanın üç yolu",
);

/* ------------------------------------------------------------------ */
/* 5 — Kendi eklentilerimiz                                            */
/* ------------------------------------------------------------------ */
const KUMELER = [
  [R.sari, "Yapı kabuğu", ["ArchiFlow Studio", "RoadFlow", "CityFill"]],
  [R.mavi, "Yapı elemanı", ["Kapı Stüdyosu", "WindowFun Studio", "StairFun", "Rampa Stüdyosu"]],
  [R.yesil, "İç mekân", ["FloorStudio", "Dolap Sihirbazı", "FurniFun", "PerdeNeşe Studio"]],
  [R.turuncu, "Cephe ve çevre", ["Kompozit Studio", "Peyzaj Stüdyosu", "Bahçe Duvarı"]],
  [R.mor, "Yardımcı", ["Yumuşak Kenar", "Dynamic Skirting", "Evrensel Dönüştürücü"]],
];

/** Çipleri 528 birimlik alana sığdırır; taşanı alt satıra indirir. */
function kume(y, renk, ad, cipler) {
  const parcalar = [];
  let x = 16;
  let satir = 0;
  for (const c of cipler) {
    const g = Math.round(c.length * 6.6 + 24);
    if (x + g > 544) {
      satir += 1;
      x = 16;
    }
    const cy = y + 22 + satir * 32;
    parcalar.push(
      `<g><rect x="${x}" y="${cy}" width="${g}" height="26" rx="13" fill="${renk}" fill-opacity="0.15" stroke="${renk}" stroke-opacity="0.5"/><text x="${x + g / 2}" y="${cy + 17}" text-anchor="middle" font-family="${F}" font-size="12" font-weight="600" fill="${renk}">${c}</text></g>`,
    );
    x += g + 8;
  }
  const yukseklik = 22 + (satir + 1) * 32;
  return {
    kod: `<g><text x="16" y="${y + 12}" font-family="${F}" font-size="13" font-weight="700" fill="${R.metin}">${ad}</text>${parcalar.join("")}</g>`,
    yukseklik: yukseklik + 10,
  };
}

let kumeY = 68;
const kumeKodlari = [];
for (const [renk, ad, cipler] of KUMELER) {
  const k = kume(kumeY, renk, ad, cipler);
  kumeKodlari.push(k.kod);
  kumeY += k.yukseklik;
}

export const sekilEklentilerimiz = svg(
  kumeY + 20,
  `${baslikBloku("Derste kullandığımız kendi eklentilerimiz", "Listedeki eklentilerin tamamı SketchUp 2026 ile uyumlu olarak listeleniyor.")}
  ${kumeKodlari.join("")}`,
  "Derste kullanılan kendi SketchUp eklentilerimiz, iş koluna göre",
);

/* ------------------------------------------------------------------ */
/* 6 — Render Fun akışı                                                */
/* ------------------------------------------------------------------ */
export const sekilRender = svg(
  430,
  `${baslikBloku("Render Fun: SketchUp penceresinden çıkmadan ışın izleme", "Dışa aktarma yok, içe aktarma yok; model doğrudan okunur.")}

  <rect x="16" y="68" width="150" height="150" rx="10" fill="${R.yuzey}" stroke="${R.cizgi}"/>
  <text x="91" y="92" text-anchor="middle" font-family="${F}" font-size="13" font-weight="700" fill="${R.mavi}">SketchUp modeli</text>
  <polygon points="51,170 91,146 131,170 131,196 51,196" fill="none" stroke="${R.mavi}" stroke-width="1.8"/>
  <line x1="91" y1="146" x2="91" y2="196" stroke="${R.mavi}" stroke-width="1" opacity="0.5"/>
  <text x="91" y="212" text-anchor="middle" font-family="${F}" font-size="11" fill="${R.solgun}">doğrudan okunur</text>

  <path d="M172 143 L192 143" stroke="${R.cizgi}" stroke-width="2" marker-end="url(#ok)"/>
  <defs><marker id="ok" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="${R.cizgi}"/></marker></defs>

  <rect x="198" y="68" width="346" height="150" rx="10" fill="${R.yuzey}" stroke="${R.cizgi}"/>
  <text x="371" y="92" text-anchor="middle" font-family="${F}" font-size="13" font-weight="700" fill="${R.sari}">Işın izleme (path tracing)</text>
  <circle cx="236" cy="116" r="6" fill="${R.sari}"/>
  <text x="236" y="107" text-anchor="middle" font-family="${F}" font-size="10" fill="${R.solgun}">ışık</text>
  <path d="M241 121 L300 162 L230 186 L350 192" fill="none" stroke="${R.sari}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M241 121 L370 140 L290 190" fill="none" stroke="${R.turuncu}" stroke-width="1.5" opacity="0.8"/>
  <path d="M241 121 L430 170 L380 196" fill="none" stroke="${R.pembe}" stroke-width="1.5" opacity="0.7"/>
  <rect x="220" y="192" width="300" height="12" rx="3" fill="${R.yuzeyUst}"/>
  <rect x="448" y="104" width="12" height="96" rx="3" fill="${R.mavi}" fill-opacity="0.22" stroke="${R.mavi}" stroke-opacity="0.6"/>
  <text x="488" y="156" text-anchor="middle" font-family="${F}" font-size="10" fill="${R.solgun}">cam</text>
  <text x="371" y="212" text-anchor="middle" font-family="${F}" font-size="11" fill="${R.solgun}">ışık duvarlardan sekerek ve camdan geçerek hesaplanır</text>

  <rect x="16" y="238" width="258" height="140" rx="10" fill="${R.yuzey}" stroke="${R.cizgi}"/>
  <text x="145" y="262" text-anchor="middle" font-family="${F}" font-size="13" font-weight="700" fill="${R.yesil}">Gürültü giderme</text>
  ${Array.from({ length: 32 }, (_, i) => `<rect x="${52 + (i % 8) * 24}" y="${278 + Math.floor(i / 8) * 20}" width="20" height="16" rx="3" fill="${R.yesil}" fill-opacity="${(0.06 + (i % 9) * 0.085).toFixed(2)}"/>`).join("")}
  <text x="145" y="366" text-anchor="middle" font-family="${F}" font-size="11" fill="${R.solgun}">önizleme ilk saniyeden temiz kalır</text>

  <rect x="286" y="238" width="258" height="140" rx="10" fill="${R.yuzey}" stroke="${R.sari}" stroke-opacity="0.55"/>
  <text x="415" y="262" text-anchor="middle" font-family="${F}" font-size="13" font-weight="700" fill="${R.sari}">Sonuç</text>
  <rect x="340" y="276" width="150" height="62" rx="6" fill="url(#gok)"/>
  <defs><linearGradient id="gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R.mavi}" stop-opacity="0.55"/><stop offset="1" stop-color="${R.turuncu}" stop-opacity="0.45"/></linearGradient></defs>
  <polygon points="356,338 415,300 474,338" fill="${R.zemin}" opacity="0.78"/>
  <text x="415" y="360" text-anchor="middle" font-family="${F}" font-size="11" fill="${R.solgun}">Render Buffer'da son 60 kare saklanır</text>

  <text x="16" y="406" font-family="${F}" font-size="11.5" fill="${R.solgun}">Render Fun ücretsizdir, lisans anahtarı istemez; SketchUp 2021–2026 ile çalışır (yalnızca Windows).</text>`,
  "Render Fun'ın çalışma akışı: model, ışın izleme, gürültü giderme, sonuç",
);

/* ------------------------------------------------------------------ */
/* 7 — Eğitim yol haritası (dikey)                                     */
/* ------------------------------------------------------------------ */
const DURAKLAR = [
  [R.mavi, "1", "Kurulum", "Sürüm seçimi, lisans, ilk açılış ve şablon"],
  [R.yesil, "2", "Arayüz", "Araçlar, çıkarım sistemi, ölçü kutusu"],
  [R.sari, "3", "Modelleme", "Grup, bileşen, etiket ve sahne düzeni"],
  [R.turuncu, "4", "Eklenti", "Kurulum yolları ve iş akışına yerleştirme"],
  [R.pembe, "5", "Render", "Işık, malzeme, kamera ve renk yönetimi"],
  [R.mor, "6", "Sunum", "LayOut ile pafta ve teslim"],
];

export const sekilYolHaritasi = svg(
  68 + DURAKLAR.length * 54 + 36,
  `${baslikBloku("Eğitimin yol haritası", "Her durak bir öncekinin üstüne biner; atlanan adım yok.")}
  <line x1="34" y1="${80}" x2="34" y2="${68 + DURAKLAR.length * 54 - 26}" stroke="${R.cizgi}" stroke-width="2"/>
  ${DURAKLAR.map(([renk, no, ad, alt], i) => {
    const y = 80 + i * 54;
    return `<g>
      <circle cx="34" cy="${y}" r="15" fill="${R.zemin}" stroke="${renk}" stroke-width="2.5"/>
      <text x="34" y="${y + 5}" text-anchor="middle" font-family="${F}" font-size="13" font-weight="800" fill="${renk}">${no}</text>
      <text x="62" y="${y - 2}" font-family="${F}" font-size="14" font-weight="700" fill="${R.metin}">${ad}</text>
      <text x="62" y="${y + 16}" font-family="${F}" font-size="12" fill="${R.solgun}">${alt}</text>
    </g>`;
  }).join("")}
  <text x="16" y="${68 + DURAKLAR.length * 54 + 20}" font-family="${F}" font-size="11.5" fill="${R.solgun}">Eklentiler ve render, temel oturduktan sonra gelir.</text>`,
  "SketchUp 2026 eğitiminin altı duraklı yol haritası",
);

/* ------------------------------------------------------------------ */
/* Kapak görseli (1600×900, ayrı ölçü — bu bir figür değil)            */
/* ------------------------------------------------------------------ */
export const kapakSvg = `<svg viewBox="0 0 1600 900" width="1600" height="900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#17171b"/><stop offset="1" stop-color="#101014"/>
    </linearGradient>
    <linearGradient id="akis" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${R.sari}"/><stop offset="0.5" stop-color="${R.turuncu}"/><stop offset="1" stop-color="${R.pembe}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  ${Array.from({ length: 33 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="900" stroke="${R.cizgi}" stroke-opacity="0.25"/>`).join("")}
  ${Array.from({ length: 19 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1600" y2="${i * 50}" stroke="${R.cizgi}" stroke-opacity="0.25"/>`).join("")}

  <g transform="translate(940 170)">
    <polygon points="0,320 280,170 560,320 560,620 0,620" fill="${R.yuzey}" stroke="${R.sari}" stroke-width="4"/>
    <polygon points="0,320 280,170 280,470 0,620" fill="${R.sari}" fill-opacity="0.12"/>
    <line x1="280" y1="170" x2="280" y2="470" stroke="${R.sari}" stroke-width="3" stroke-opacity="0.7"/>
    <line x1="0" y1="620" x2="280" y2="470" stroke="${R.sari}" stroke-width="3" stroke-opacity="0.7"/>
    <line x1="280" y1="470" x2="560" y2="620" stroke="${R.sari}" stroke-width="3" stroke-opacity="0.7"/>
    <rect x="70" y="420" width="110" height="120" fill="${R.mavi}" fill-opacity="0.35" stroke="${R.mavi}" stroke-width="3"/>
    <rect x="360" y="440" width="120" height="130" fill="${R.mor}" fill-opacity="0.3" stroke="${R.mor}" stroke-width="3"/>
    <circle cx="150" cy="60" r="34" fill="${R.sari}"/>
    <path d="M160 92 L340 300 L120 420" fill="none" stroke="url(#akis)" stroke-width="5" stroke-linejoin="round" stroke-opacity="0.9"/>
    <path d="M160 92 L470 260 L300 480" fill="none" stroke="${R.pembe}" stroke-width="4" stroke-opacity="0.65"/>
  </g>

  <text x="110" y="300" font-family="${F}" font-size="36" font-weight="700" fill="${R.sari}" letter-spacing="6">SKETCHUP 2026</text>
  <text x="110" y="400" font-family="${F}" font-size="82" font-weight="800" fill="${R.metin}">Profesyonel</text>
  <text x="110" y="494" font-family="${F}" font-size="82" font-weight="800" fill="${R.metin}">Eğitim</text>
  <rect x="110" y="540" width="180" height="6" rx="3" fill="url(#akis)"/>
  <text x="110" y="606" font-family="${F}" font-size="30" fill="${R.solgun}">Kurulum · Arayüz · Eklenti kurma</text>
  <text x="110" y="652" font-family="${F}" font-size="30" fill="${R.solgun}">Kendi eklentilerimiz · Render Fun ile görselleştirme</text>
  <text x="110" y="742" font-family="${F}" font-size="26" font-weight="700" fill="${R.sari}">ufuksen.com</text>
</svg>`;
