// Generator daftar kota/kabupaten seluruh Indonesia untuk jadwal shalat (modul falak).
//
// Sumber data: dataset wilayah Kemendagri dari https://github.com/cahyadsn/wilayah
//   db/wilayah_level_1_2.sql (514 kabupaten/kota + 38 provinsi, dengan koordinat & zona waktu).
//
// Cara pakai:
//   node scripts/gen-cities.mjs
//
// Skrip ini:
//   1. Mengunduh db/wilayah_level_1_2.sql ke scripts/.cache/ bila belum ada (atau saat
//      ukurannya tidak sesuai). Hapus file cache untuk memaksa unduh ulang.
//   2. Membaca 514 kabupaten/kota dan menggabungkannya dengan provinsi (38) menjadi
//      lib/cities.ts dengan format:
//        - Kota  -> nama saja        (contoh: "Banda Aceh", "Surabaya")
//        - Kabupaten -> "Ibukota (NamaKabupaten)" (contoh: "Tapak Tuan (Aceh Selatan)")
//   3. Menormalisasi penamaan khusus (Jakarta, Kepulauan Seribu, nama provinsi).
//   4. Memvalidasi hasil (jumlah entri, rentang koordinat, zona waktu, duplikat).
//
// CATATAN koreksi data upstream (kesalahan di dataset asli):
//   - Kabupaten Wakatobi (kode 74.07): longitude 23.5389 -> 123.5389 (digit '1' hilang).
//     Perbaikan diterapkan lewat konstanta LONGITUDE_FIX agar regenerasi selalu benar.
//
// Selalu jalankan `npm run check` (lint + typecheck) setelah meregenerasi lib/cities.ts.

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SQL_URL =
  "https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah_level_1_2.sql";
const CACHE_DIR = join(REPO_ROOT, "scripts", ".cache");
const SQL_PATH = join(CACHE_DIR, "wilayah_level_1_2.sql");
const OUT_PATH = join(REPO_ROOT, "lib", "cities.ts");

const PROVINCE_NAME = {
  "Daerah Khusus Ibukota Jakarta": "DKI Jakarta",
  "Daerah Istimewa Yogyakarta": "DI Yogyakarta",
  "Kepulauan Bangka Belitung": "Bangka Belitung",
};

// Koreksi untuk typo di dataset upstream, keyed oleh kode kab/kota.
const LONGITUDE_FIX = {
  74.07: 123.5389007621827, // Wakatobi: dataset menghilangkan digit '1' (23.53 -> 123.53)
};

// Row pattern: ('kode','nama','ibukota', lat, lng, elv, tz, ...)
const rowRe =
  /\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+)\s*,/g;

function clean(s) {
  return s.replace(/\s+/g, " ").trim();
}

function displayName(nama, ibukota) {
  const raw = clean(nama);
  const capital = clean(ibukota);

  if (raw === "Kabupaten Administrasi Kepulauan Seribu")
    return "Kepulauan Seribu";
  const jakarta = /^Kota Administrasi Jakarta (.+)$/.exec(raw);
  if (jakarta) return `Jakarta ${jakarta[1]}`;

  const isKota = raw.startsWith("Kota ");
  const baseName = raw.replace(/^(Kabupaten |Kota )/, "");
  if (isKota) return baseName;
  return capital ? `${capital} (${baseName})` : baseName;
}

function tzName(t) {
  if (t === 9) return "WIT";
  if (t === 8) return "WITA";
  return "WIB";
}

async function ensureSql() {
  if (existsSync(SQL_PATH) && statSync(SQL_PATH).size > 1_000_000) {
    console.log(`[gen-cities] Memakai cache: ${SQL_PATH}`);
    return;
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`[gen-cities] Mengunduh dataset wilayah dari ${SQL_URL} ...`);
  const res = await fetch(SQL_URL);
  if (!res.ok) {
    throw new Error(`Gagal mengunduh dataset (HTTP ${res.status}): ${SQL_URL}`);
  }
  writeFileSync(SQL_PATH, Buffer.from(await res.arrayBuffer()));
  console.log("[gen-cities] Dataset tersimpan ke", SQL_PATH);
}

function parseSql() {
  const sql = readFileSync(SQL_PATH, "utf8");
  const rows = [];
  let m;
  while ((m = rowRe.exec(sql)) !== null) {
    const [, kode, nama, ibukota, lat, lng, , tz] = m;
    rows.push({
      kode,
      nama,
      ibukota,
      lat: Number(lat),
      lng: LONGITUDE_FIX[kode] ?? Number(lng),
      tz: Number(tz),
    });
  }

  const provinces = new Map();
  for (const r of rows) {
    if (/^[0-9]{2}$/.test(r.kode)) provinces.set(r.kode, r);
  }
  const kabKota = rows.filter((r) => /^[0-9]{2}\.[0-9]{2}$/.test(r.kode));
  return { provinces, kabKota };
}

function build({ provinces, kabKota }) {
  const out = [];
  out.push("export interface City {");
  out.push("  name: string;");
  out.push("  province: string;");
  out.push("  latitude: number;");
  out.push("  longitude: number;");
  out.push("  timezone: number; // +7 (WIB), +8 (WITA), +9 (WIT)");
  out.push("  timezoneName: string; // WIB, WITA, WIT");
  out.push("}");
  out.push("");
  out.push("export const INDONESIA_CITIES: City[] = [");

  let currentProvKode = "";
  for (const r of kabKota) {
    const provKode = r.kode.split(".")[0];
    const prov = provinces.get(provKode);
    if (!prov) continue;

    if (provKode !== currentProvKode) {
      currentProvKode = provKode;
      const provName = PROVINCE_NAME[prov.nama] ?? prov.nama;
      out.push("");
      out.push(`  // --- ${provName.toUpperCase()} ---`);
    }

    const name = displayName(r.nama, r.ibukota);
    const provName = PROVINCE_NAME[prov.nama] ?? prov.nama;
    out.push(
      `  { name: '${name}', province: '${provName}', latitude: ${r.lat.toFixed(4)}, longitude: ${r.lng.toFixed(4)}, timezone: ${r.tz}, timezoneName: '${tzName(r.tz)}' },`,
    );
  }

  out.push("];");
  out.push("");
  out.push("export const DEFAULT_CITY: City =");
  out.push(
    '  INDONESIA_CITIES.find((c) => c.name === "Jakarta Pusat") ?? INDONESIA_CITIES[0];',
  );
  out.push("");
  return out.join("\n");
}

function validate(cities) {
  const problems = [];
  for (const c of cities) {
    if (c.name !== c.name.trim()) problems.push(`name whitespace: ${c.name}`);
    if (c.province !== c.province.trim())
      problems.push(`province whitespace: ${c.province}`);
    if (/\s{2}/.test(c.name)) problems.push(`double space: ${c.name}`);
    if (c.latitude < -11.5 || c.latitude > 6.5)
      problems.push(`latitude out of range: ${c.name}`);
    if (c.longitude < 95 || c.longitude > 141.5)
      problems.push(`longitude out of range: ${c.name}`);
  }
  const keys = new Map();
  for (const c of cities) {
    const k = `${c.name}|${c.province}`;
    keys.set(k, (keys.get(k) ?? 0) + 1);
  }
  for (const [k, v] of keys)
    if (v > 1) problems.push(`duplicate key: ${k} x${v}`);
  return problems;
}

async function main() {
  await ensureSql();
  const { provinces, kabKota } = parseSql();
  const result = build({ provinces, kabKota });
  writeFileSync(OUT_PATH, result, "utf8");

  const cities = [
    ...result.matchAll(
      /  \{ name: '([^']*)', province: '([^']*)', latitude: ([-\d.]+), longitude: ([-\d.]+), timezone: (\d+), timezoneName: '([^']*)' \},/g,
    ),
  ].map((m) => ({
    name: m[1],
    province: m[2],
    latitude: Number(m[3]),
    longitude: Number(m[4]),
    timezone: Number(m[5]),
    timezoneName: m[6],
  }));
  const problems = validate(cities);

  console.log("[gen-cities] provinsi:", provinces.size);
  console.log("[gen-cities] kabupaten/kota:", kabKota.length);
  console.log("[gen-cities] entri:", cities.length);
  console.log("[gen-cities] ditulis ke:", OUT_PATH);
  if (problems.length === 0) {
    console.log("[gen-cities] validasi: OK");
  } else {
    console.error("[gen-cities] validasi GAGAL:");
    for (const p of problems) console.error("  -", p);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    "[gen-cities] Gagal:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
