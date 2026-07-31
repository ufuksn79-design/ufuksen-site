# Yayına Alma Runbook'u

Sıra önemlidir. Her adım bir öncekinin doğrulanmasına bağlıdır.

## 0. Kimlik bilgileri

```bash
cp .env.example .env
```

`.env` dosyasını doldurun. Parola **yalnızca burada** durur; `.gitignore` içindedir, repoya ve sohbete girmez.

Bilinen değerler:

| Alan | Değer |
|---|---|
| `FTP_USER` | `usen` |
| `FTP_HOST` | `ni-maria.guzelhosting.com` (IP `31.192.212.111`) — **doğrulandı, port 21 açık** |
| `FTP_SECURE` | **Sunucuda TLS çalışmıyor** (bkz. aşağıdaki uyarı). Düz FTP kullanılacaksa `false` yapılmalıdır. |
| `FTP_ROOT` | `/public_html` (panelden teyit edin) |

> **`ftp.ufuksen.com` KULLANMAYIN.** O ad Cloudflare IP'lerine çözülüyor ve Cloudflare FTP trafiğini geçirmez; bağlantı zaman aşımına uğrar. Doğrudan sunucu adını kullanın.

### Güvenli bağlantı sorunu — karar gerektirir

Sunucu `FEAT` yanıtında `AUTH TLS` desteklediğini bildiriyor, ancak komut gönderildiğinde `500 This security scheme is not implemented` dönüyor. Implicit FTPS (990) ve SFTP/SSH (22) portları kapalı.

Ölçülen durum:

| Yöntem | Port | Sonuç |
|---|---|---|
| FTPS (explicit, AUTH TLS) | 21 | ilan ediliyor ama **çalışmıyor** |
| FTPS (implicit) | 990 | zaman aşımı |
| SFTP / SSH | 22 | bağlantı reddedildi |
| Düz FTP | 21 | çalışıyor — **parola açık metin gider** |

Seçenekler:

1. **Dosya Yöneticisi ile zip yükleme (önerilen).** FTP hiç kullanılmaz, parola ağa çıkmaz, 2337 dosya yerine tek dosya gider.
2. **GüzelHosting'den TLS'i düzeltmesini isteyin.** Kalıcı ve doğru çözüm.
3. **Düz FTP'yi bilerek kabul edin.** `.env` içinde `FTP_SECURE=false` yapın. Bu durumda işlem sonrası FTP parolasını değiştirmeniz önerilir.

Script kendiliğinden düz FTP'ye düşmez; bu tercih açıkça yapılmalıdır.

## 1. Yedek — atlanamaz

`AGENTS.md`: yedek alınmadan destructive işlem yapılmaz.

### 1a. Dosya yedeği (FTP)

```bash
npm run backup:list
```

Önce yalnızca listeler ve boyutu gösterir. Sonra:

```bash
npm run backup:download
```

`backups/ftp-<tarih>/` altına iner, `manifest.json` ile birlikte.

### 1b. Veritabanı yedeği — FTP ile alınamaz

**Bunu ben yapamam.** WordPress içeriği veritabanındadır ve FTP'de görünmez. cPanel/hosting panelinden:

- **phpMyAdmin → Dışa Aktar → SQL**, veya
- **cPanel → Yedekler → MySQL Veritabanı İndir**

İnen `.sql` dosyasını `backups/` içine koyun.

### 1c. Yedeği doğrulayın

Yedek, geri yüklenebildiği kanıtlanana kadar yedek sayılmaz:

- `.sql` dosyası boyutu makul mü (birkaç MB'tan küçükse şüphelenin)?
- `manifest.json` içindeki dosya sayısı sunucudakiyle uyuşuyor mu?
- Mümkünse yedeği bir test ortamına geri yükleyin.

## 2. Staging'e yükle

Canlı siteye dokunmadan, alt dizine:

```bash
npm run deploy:plan
```

```bash
npm run deploy:staging
```

Yaklaşık **2337 dosya / 160 MB**. FTP üzerinden bir süre alır.

Sonra `https://www.ufuksen.com/yeni/` adresini kontrol edin.

> Not: Alt dizinde kök göreli yollar (`/media/...`, `/blog`) çalışmaz — staging'de görseller ve linkler kırık görünecektir. Bu beklenen davranıştır; **sayfa yapısını ve içeriği** doğrulamak içindir. Yol doğruluğunu asıl olarak yerel `npm run preview` gösterir.
>
> Daha temiz bir staging istiyorsanız `staging.ufuksen.com` gibi bir alt alan adı açın ve `FTP_STAGING_DIR` değerini onun köküne verin — o zaman tüm yollar doğru çalışır. Önerilen yol budur.

## 3. Canlıya geçiş kararı

Bu adım geri alınamaz ve **onayınızla** yapılmalıdır.

Yeni site statiktir; WordPress'i **silmez** ama aynı dizine yüklenirse `index.php` yerine `index.html` sunulmaya başlar ve site WordPress'ten çıkar.

Geçmeden önce kontrol listesi:

- [ ] Dosya + veritabanı yedeği alındı ve doğrulandı
- [ ] Staging'de içerik doğrulandı
- [ ] `.htaccess` yedeklendi (WordPress yönlendirme kuralları burada)
- [ ] Rollback planı net: yedekten `index.php` ve `.htaccess` geri yüklenince WordPress döner

Sonra:

```bash
node scripts/deploy/ftp-deploy.mjs --target=live --upload --i-have-a-verified-backup
```

Bu bayrak olmadan script çalışmayı reddeder (çıkış kodu 3).

## 4. Yönlendirmeler

Hosting LiteSpeed/Apache olduğu için `.htaccess` kullanılır. `npm run redirects` her iki biçimi de üretir:

- `public/.htaccess` — **bu sunucu için geçerli olan** (59 yönlendirme + AMP + attachment + sıkıştırma + önbellek + güvenlik başlıkları)
- `public/_redirects` — yalnızca ileride Netlify/Cloudflare Pages'e geçilirse

> `.htaccess` canlı köke yüklenirse WordPress'in mevcut `.htaccess` dosyasının **üzerine yazar**. Geçişten önce mutlaka indirip saklayın.

## 4b. Zip ile yükleme (önerilen yöntem)

```bash
npm run package
```

`site-yukle.zip` (149 MB, 2352 dosya) üretir. Sonra hosting panelinde:

1. **Dosya Yöneticisi** → hedef klasöre girin (staging için `public_html/yeni`)
2. **Yükle** → `site-yukle.zip`
3. Yüklenen dosyaya sağ tık → **Ayıkla / Extract**
4. Zip dosyasını sunucudan silin

Bu yöntem FTP parolasını ağa hiç çıkarmaz ve 2337 ayrı transfer yerine tek transfer yapar.

## 5. Geçiş sonrası

- [ ] Kritik URL smoke testi (`docs/inventory/url-list.txt` içinden örneklem)
- [ ] Search Console'a yeni sitemap: `https://www.ufuksen.com/sitemap-index.xml`
- [ ] 404 takibi
- [ ] Analytics doğrulaması

## Rollback

1. Yedekten `index.php`, `.htaccess` ve `wp-*` dosyalarını geri yükleyin.
2. Gerekirse veritabanını `.sql` dosyasından geri alın.
3. Yeni statik dosyalar WordPress'i ezmez; `index.html` silinince WordPress yeniden devreye girer.
