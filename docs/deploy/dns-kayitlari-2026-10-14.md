# ufuksen.com DNS kayıtları — 2026-10-14 (geçişten önceki hâl)

Cloudflare panelinden okundu (hesap `Ufuksn79@gmail.com`, bölge `ufuksen.com`,
plan: free). **24 kayıt.** Alan adını Worker'a bağlamadan önce, geri dönüş
yapılabilsin diye birebir yazıldı.

Hosting IP'si: `31.192.212.112` (GüzelHosting)

## A kayıtları

| Ad | İçerik | Proxy |
|---|---|---|
| `autoconfig.ufuksen.com` | 31.192.212.112 | Proxied |
| `autodiscover.ufuksen.com` | 31.192.212.112 | Proxied |
| `cpanel.ufuksen.com` | 31.192.212.112 | Proxied |
| `cpcalendars.ufuksen.com` | 31.192.212.112 | Proxied |
| `cpcontacts.ufuksen.com` | 31.192.212.112 | Proxied |
| `ftp.ufuksen.com` | 31.192.212.112 | Proxied |
| `localhost.ufuksen.com` | 127.0.0.1 | DNS only |
| **`ufuksen.com`** | **31.192.212.112** | **Proxied** |
| `webdisk.ufuksen.com` | 31.192.212.112 | Proxied |
| `webmail.ufuksen.com` | 31.192.212.112 | Proxied |
| `whm.ufuksen.com` | 31.192.212.112 | Proxied |

## CNAME kayıtları

| Ad | İçerik | Proxy |
|---|---|---|
| `mail.ufuksen.com` | ufuksen.com | Proxied |
| **`www.ufuksen.com`** | **ufuksen.com** | **Proxied** |

## MX

| Ad | İçerik | Öncelik | Proxy |
|---|---|---|---|
| `ufuksen.com` | `ufuksen.com` | 0 | DNS only |

## SRV

| Ad | İçerik |
|---|---|
| `_autodiscover._tcp.ufuksen.com` | 0 443 cpanelemaildiscovery.cpanel.net |
| `_caldavs._tcp.ufuksen.com` | 0 2080 ni-maria.guzelhosting.com |
| `_caldav._tcp.ufuksen.com` | 0 2079 ni-maria.guzelhosting.com |
| `_carddavs._tcp.ufuksen.com` | 0 2080 ni-maria.guzelhosting.com |

## TXT

| Ad | İçerik |
|---|---|
| `_caldavs._tcp.ufuksen.com` | `path=/` |
| `_caldav._tcp.ufuksen.com` | `path=/` |
| `_carddavs._tcp.ufuksen.com` | `path=/` |
| `_carddav._tcp.ufuksen.com` | `path=/` |
| `_dmarc.ufuksen.com` | `v=DMARC1;p=none;sp=none;adkim=r;aspf=r;pct=100;fo…` (kesik görünüyordu) |
| `ufuksen.com` | `v=spf1 include:ufuksen.com ~all` |

---

## E-POSTA UYARISI — apex kaydı silinemez

`MX` kaydı `ufuksen.com` konağını gösteriyor ve o konak da `A` kaydıyla
hosting IP'sine çözülüyor. SPF kaydı da (`include:ufuksen.com`) aynı ada
bakıyor.

Yani **`ufuksen.com` A kaydı Worker'a çevrilirse gelen e-posta bozulur.**
Bu yüzden apex için `custom_domain` kullanılmıyor; apex'te DNS olduğu gibi
bırakılıp Cloudflare **Redirect Rule** ile www'ye yönlendiriliyor. Redirect
Rule istek origin'e ulaşmadan Cloudflare kenarında çalışır, dolayısıyla
ziyaretçi hosting'i hiç görmez ama MX/SPF çözümlemesi bozulmaz.

## Geçişte değişen tek kayıt

`www.ufuksen.com` CNAME silindi; yerine Cloudflare'in Worker özel alan adı
kaydı geldi. Geri dönüş: bu kaydı silip yukarıdaki CNAME'i (`ufuksen.com`,
Proxied, Auto TTL) yeniden oluşturmak.
