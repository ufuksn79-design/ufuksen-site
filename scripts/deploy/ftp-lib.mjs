/**
 * Ortak FTP yardımcıları.
 *
 * Kimlik bilgileri YALNIZCA `.env` dosyasından okunur. Parola hiçbir yere
 * yazdırılmaz, loglanmaz ve repoya girmez (`.gitignore`).
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Client } from "basic-ftp";

/** `.env` dosyasını okur. Yoksa süreç ortam değişkenlerine düşer. */
export async function loadEnv(root) {
  const env = { ...process.env };
  try {
    const text = await readFile(join(root, ".env"), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (value) env[key] = value;
    }
  } catch {
    // .env yoksa sessiz geçilir; eksik alan aşağıda açıkça raporlanır.
  }
  return env;
}

export function requireConfig(env) {
  const missing = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"].filter((key) => !env[key]);
  if (missing.length) {
    console.error(
      `Eksik ayar: ${missing.join(", ")}\n` +
        "`.env.example` dosyasını `.env` olarak kopyalayıp doldurun.\n" +
        "Parolayı sohbete veya repoya yazmayın.",
    );
    process.exit(2);
  }
  return {
    host: env.FTP_HOST,
    user: env.FTP_USER,
    password: env.FTP_PASSWORD,
    secure: (env.FTP_SECURE ?? "true").toLowerCase() !== "false",
    root: env.FTP_ROOT || "/public_html",
    staging: env.FTP_STAGING_DIR || "/public_html/yeni",
    backupDir: env.BACKUP_DIR || "./backups",
  };
}

/**
 * Bağlanır. Güvenli bağlantı başarısız olursa DÜZ FTP'ye kendiliğinden
 * düşmez — parolayı açık metin göndermek sessizce yapılacak bir tercih
 * değildir; kullanıcı bilinçli olarak FTP_SECURE=false demelidir.
 */
export async function connect(config, { verbose = false } = {}) {
  const client = new Client(30_000);
  client.ftp.verbose = verbose;
  await client.access({
    host: config.host,
    user: config.user,
    password: config.password,
    secure: config.secure,
    secureOptions: { rejectUnauthorized: false },
  });
  return client;
}

export function human(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}
