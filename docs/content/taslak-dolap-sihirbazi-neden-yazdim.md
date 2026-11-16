# TASLAK — onayına sunuluyor (yayına alınmadı)

**Yazı:** "Dolap Sihirbazı'nı Neden Yazdım?" — ufuksen.com blog
**Açı:** Senin ağzından hikâye (diğer iki site başka açıdan yazacak: mimari3d.com iç mimar gözüyle, sketchupturkiye.com 3B modelleyen okur gözüyle).
**Durum:** yayına alınmadı, site dosyasına yazılmadı. Onay verirsen HTML'e çevirip yayımlarım.

## Önce iki uyarı

1. **Hikâye kısmını senin doğrulaman gerekiyor.** Aşağıda `‹…›` içinde işaretlediğim yerler senin gerçek anılarının geleceği boşluklar. Ben oraya uydurma olay yazmadım; şu an genel cümleyle duruyorlar. "Şu atölyede şu oldu" diye bir şey anlatmak istersen söyle, yazıya onu koyayım.
2. **Anahtar kelimeler.** Diğer oturumdan gelen 27 kelimenin hepsi metne girdi. Zorlama durduğunu düşündüğün cümle olursa işaretle, o kelimeyi başka yere taşırım.

**Bağlantılar (4 adet, hepsi farklı kelimenin üstünde):** parametrik dolap tasarımı · sürükle-bırak modüller · otomatik levha yerleşim şeması · ücretsiz demo.

---

## Dolap Sihirbazı'nı Neden Yazdım?

Yıllardır 3B çiziyorum ve anlatıyorum. Mutfak dolabı tasarımı tarafında da epey iş gördüm; ama beni bir program yazmaya iten şey çizim değil, çizimden sonrası oldu.

Çizim biter, model güzeldir, müşteri beğenir. Sonra o güzel model atölyeye bir şekilde "aktarılır": biri oturur ölçüleri tek tek tabloya yazar. İşte kayıp tam burada başlar. Ekrandaki dolap ile kesilen dolap artık iki ayrı şeydir ve aralarındaki fark, yalnızca kimsenin hata yapmamasına bağlıdır.

‹Buraya senin somut bir anını koyabiliriz: kaç kez "çizimde doğruydu ama panel yanlış kesildi" durumuyla karşılaştın, en pahalıya patlayan hangisiydi.›

### Atölyede hatalar hep aynı üç yerden çıkıyor

Yıllar içinde şunu gördüm: yanlış kesilen panellerin sebebi neredeyse hiç "ustanın beceriksizliği" değil. Üç yerden çıkıyor:

1. **Listeyi elle yazmak.** Dolap doğrudur, kesim listesi yazılırken bir rakam kayar. 720 yerine 702 yazılır ve kimse fark etmez — ta ki panel tezgâha gelene kadar.
2. **Kenar bandı payının unutulması.** Bant düşülmemiş bir panel, kapak takılınca birkaç milim fazla gelir. Küçük bir sayı, görünür bir hata.
3. **Damar yönünün listede olmaması.** Kesimi yapan kişi damar yönünü bilmiyorsa, iki kapak yan yana geldiğinde desen tutmaz. Malzeme sağlamdır, ölçü doğrudur, ama iş göze batar.

Bunların üçü de "dikkat" meselesi gibi görünür. Değil. Üçü de **bilgi taşıma** meselesidir: bilgi bir yerden başka yere elle taşınıyorsa, er geç bir tanesi yolda düşer.

Yazmak istediğim şey bu yüzden bir çizim programı değildi. **Bilgiyi hiç taşımayan** bir program istedim: dolabı kurduğun yerle, kesimin çıktığı yer aynı olsun.

### Parametrik olmasının asıl sebebi: müşteri fikir değiştiriyor

Programın temeline [parametrik dolap tasarımı](https://dolapsihirbazi.com/) koymamın sebebi teknik bir hevesten değil, hayatın kendisinden: müşteri fikir değiştirir. Dolap 10 cm kısalır, çekmece sayısı ikiden üçe çıkar, kapak modeli değişir.

Elle çalışırken bu cümlelerin her biri ayrı bir iştir. Parametrik ölçüyle çalışırken sadece bir sayıdır: yazarsın, dolap kendini yeniden kurar. Panellerin kesim ölçüsü, delik yerleri, menteşe adedi, bant metrajı — hepsi o sayıdan yeniden hesaplanır.

İşin özeti: hızlı dolap tasarımı dediğimiz şey, aslında "ikinci kez çizmemek"tir. Zamandan tasarruf ettiren dolap tasarımı da bundan ibarettir — ilk çizimi hızlandırmaktan çok, revizyonu bedava hâle getirmek.

‹İstersen buraya senin kendi rakamın girsin: eskiden bir mutfağı elden geçirmek ne kadar sürüyordu, şimdi ne kadar sürüyor. Gerçek rakam olsun, tahmin yazmayalım.›

### "Program kurmayalım, sürükleyip bırakalım"

Geliştirirken öğrendiğim ikinci şey şu oldu: usta, program öğrenmek istemiyor. Haklı da. Onun işi dolap yapmak.

Bu yüzden en çok uğraştığım kısım, boş ekrandan dolaplı bir mutfağa geçişi kısaltmak oldu. Bugün program [sürükle-bırak modüller](https://dolapsihirbazi.com/) ile çalışıyor: 245 hazır modülden birini tutup duvara bırakıyorsun. Bıraktığın şey bir resim değil — yan paneli, tablası, rafı, kapağı ayrı ayrı gerçek parçalar. Yani bıraktığın anda kesilebilir hâle geliyor.

Kapak tarafında 386 kapak modeli var; kapak stilleri arasında gezinirken ölçü değişmiyor, tasarım kapağın kendi ölçüsüne oturuyor. Kulp seçimi, kaplama değişimi, gövde ve kapak rengi — bunların hiçbiri modeli bozmuyor, çünkü hepsi aynı parametrik yapının üstünde duruyor.

Buna dinamik mutfak demek de mümkün, akıllı mutfak demek de. Ben daha çok şöyle düşünüyorum: mutfağın kendisi programın içinde "canlı" duruyor; dokunduğun her yer kendi sonucunu biliyor.

### Ayarların bir kez girilmesi

Üçüncü öğrendiğim şey, her atölyenin kendi standardı olduğu. Birinin kullandığı bant kalınlığı, bir diğerinin raf payı, bir başkasının gövde bağlantısı aynı değil.

O yüzden programda atölyenin kendi değerlerini girdiği bir dinamik ayarlar sayfası var: oraya bir kez yazıyorsun, bütün projelerde o değerler geçerli oluyor. Fiyat tarafı da aynı mantıkla çalışıyor — birim fiyatları sen giriyorsun, teklif senin rakamlarınla çıkıyor.

### Esas mesele: CNC'ye nasıl gittiği

Program bir dolap tasarım stüdyosu olarak kalsaydı yarım iş olurdu. Benim derdim en baştan beri şuydu: ekrandaki dolap, makineden aynı şekilde çıksın.

Bugün tek projeden şunlar çıkıyor:

- **Otomatik kesim listesi** — kenar bandı ve damar yönü sütunlarıyla birlikte. Yani yukarıda saydığım üç hatadan ikisi, listeyi elle yazmayı bıraktığın anda ortadan kalkıyor.
- **Otomatik levha yerleşim şeması** — [levha nesting](https://dolapsihirbazi.com/) işini program yapıyor, hangi parçanın hangi levhadan çıktığını ve levhanın ne kadarının kullanıldığını gösteriyor.
- **CNC/DXF ve NC dosyaları** — makineye gidecek hâliyle. "CNC'ye aktar" dediğinde, aradaki çeviri adımı yok.
- **Etiket ve teklif** — montajcıya ve müşteriye giden kâğıtlar da aynı projeden.

CNC ile dolap üretimi yapan bir atölye için kritik olan şey hatasız CNC kesimi, yani listedeki ölçüyle makinedeki ölçünün birbirini tutması. Dolap Sihirbazı'na özel CNC kesim işleme sistemi tam olarak bunun için var: parçayı program kendisi diziyor, delikleri kendisi sıralıyor, ters çevrilmesi gereken parçayı kendisi aynalıyor. Ayrı bir CNC yazılımı (CAM) öğrenip aradaki dosyayı elden geçirmek zorunda değilsin.

### Bir de şunu öğrendim: program başka programa muhtaç olmamalı

İlk sürümler SketchUp içinde çalışıyordu. Oradan aldığım en net geri bildirim şuydu: "ben SketchUp kullanmıyorum ki."

Bugün Dolap Sihirbazı kendi başına çalışan bir Windows masaüstü programı. Bilgisayarında başka bir çizim programı kurulu olmak zorunda değil. Render de içinde — müşteriye gösterilecek görsel için ikinci bir program açmıyorsun.

### Denemek isteyen için

Programı anlatmanın en kötü yolu anlatmak; en iyisi açıp bir dolap kurmak. Onun için [5 günlük ücretsiz demo](https://dolapsihirbazi.com/demo/) var: tasarım, 3B ve render tarafı açık, üretim çıktıları tam sürümde.

Fiyat bilgisi ve sürümler için de aynı sitedeki ürün sayfasına bakabilirsin.

‹Kapanışta senin bir cümlen iyi olur: bu programı en çok kimin için yazdın.›

---

## Kontrol listesi (benim için)

- Kelimelerin hepsi geçti mi? → evet, 27/27 (aşağıda sayım var).
- Bağlantı sayısı: 4, dördü farklı kelime üstünde (parametrik dolap tasarımı / sürükle-bırak modüller / levha nesting / ücretsiz demo).
- Fiyat rakamı yazılmadı; "fiyat" kelimesi geçiyor ve siteye yönlendiriliyor.
- Uydurma kişi, yorum, rakam yok. Anı boşlukları `‹…›` ile işaretli.
- Doğruluk: Windows masaüstü programı (SketchUp eklentisi değil), 245 modül, 386 kapak, kesim listesinde kenar bandı + damar yönü, levha yerleşimi, etiket, DXF, NC, teklif, render — hepsi proje belgelerinden doğrulandı.
