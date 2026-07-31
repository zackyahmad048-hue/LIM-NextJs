// Import data Imsakiyah dari Google Sheet ke database (model Imsakiyah).
//
// Cara pakai:
//   1. Isi .env dengan DATABASE_URL dan kredensial Google Sheet:
//      - GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY + GOOGLE_SHEET_ID  (nama lama)
//      - atau GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
//        + GOOGLE_SPREADSHEET_FALAK_ID (nama standar integrasi)
//   2. Jalankan:  npm run import:imsakiyah
//
// Perilaku: isi tabel imsakiyah di-replace (kosongkan dulu, lalu insert
// semua baris dari sheet). Baris pertama sheet = header kolom.

import "dotenv/config";

import { google } from "googleapis";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client";

const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ?? process.env.GOOGLE_SPREADSHEET_FALAK_ID;
const CLIENT_EMAIL =
  process.env.GOOGLE_CLIENT_EMAIL ?? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY =
  process.env.GOOGLE_PRIVATE_KEY ?? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error(
    "[import-imsakiyah] Kredensial Google belum lengkap di .env. Butuh " +
      "GOOGLE_SHEET_ID + GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY (atau varian " +
      "GOOGLE_SPREADSHEET_FALAK_ID + GOOGLE_SERVICE_ACCOUNT_*)."
  );
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("[import-imsakiyah] DATABASE_URL belum diisi di .env.");
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: CLIENT_EMAIL,
  key: PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

function toNumber(value: string): number | null {
  const v = value.replace(/\s/g, "");
  if (v === "" || v === "-") return null;
  let s = v;
  if (s.includes(".") && s.split(".").length > 2) s = s.replace(/\./g, "");
  s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const TIME_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;
const TIME_FIELDS = ["Imsak", "Subuh", "Terbit", "Dhuha", "Dzuhur", "Ashar", "Maghrib", "Isya"];

async function main() {
  console.log(`Membaca sheet: ${SHEET_ID}`);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "A1:Z1000",
  });
  const rows = res.data.values ?? [];
  if (rows.length === 0) {
    console.error("[import-imsakiyah] Sheet kosong.");
    process.exit(1);
  }

  const header = rows[0].map((h) => String(h).trim());
  const col = (name: string) => header.indexOf(name);
  const cell = (row: string[], name: string) => {
    const idx = col(name);
    return idx < 0 ? "" : (row[idx] ?? "").toString().trim();
  };

  const required = ["Tanggal_Masehi", "Ramadan_Ke", "Provinsi", "Kota_Kabupaten"];
  const missing = required.filter((name) => col(name) < 0);
  if (missing.length > 0) {
    console.error(`[import-imsakiyah] Header kolom tidak ditemukan: ${missing.join(", ")}`);
    process.exit(1);
  }

  const warnings: string[] = [];
  const dataRows = rows.slice(1).filter((row) => row.some((v) => String(v).trim() !== ""));

  const records = dataRows.map((row, i) => {
    const no = i + 1;
    const latitude = toNumber(cell(row, "Latitude"));
    const longitude = toNumber(cell(row, "Longitude"));
    const dateStr = cell(row, "Tanggal_Masehi");

    if (latitude !== null && (latitude < -90 || latitude > 90)) {
      warnings.push(`Baris ${no}: Latitude di luar rentang (-90..90): ${cell(row, "Latitude")}`);
    }
    if (longitude !== null && (longitude < -180 || longitude > 180)) {
      warnings.push(`Baris ${no}: Longitude di luar rentang (-180..180): ${cell(row, "Longitude")}`);
    }
    for (const field of TIME_FIELDS) {
      const v = cell(row, field);
      if (v && !TIME_RE.test(v)) {
        warnings.push(`Baris ${no}: ${field} bukan format waktu (HH:MM): ${v}`);
      }
    }

    return {
      no,
      gregorianDate: new Date(`${dateStr}T00:00:00Z`),
      dayName: cell(row, "Hari"),
      javaneseDay: cell(row, "Hari_Pasaran_Jawa"),
      ramadanDay: toNumber(cell(row, "Ramadan_Ke")) ?? no,
      hijriDate: toNumber(cell(row, "Tanggal_Hijriah")) ?? no,
      hijriMonth: cell(row, "Bulan_Hijriah"),
      hijriYear: cell(row, "Tahun_Hijriah"),
      province: cell(row, "Provinsi"),
      city: cell(row, "Kota_Kabupaten"),
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
      elevation: toNumber(cell(row, "Elevasi_mdpl")),
      googleMapsLink: cell(row, "Link_Google_Maps") || null,
      imsak: cell(row, "Imsak"),
      subuh: cell(row, "Subuh"),
      terbit: cell(row, "Terbit"),
      dhuha: cell(row, "Dhuha"),
      dzuhur: cell(row, "Dzuhur"),
      ashar: cell(row, "Ashar"),
      maghrib: cell(row, "Maghrib"),
      isya: cell(row, "Isya"),
      moonPhase: cell(row, "Fase_Bulan") || null,
      eclipseData: cell(row, "Data_Gerhana") || null,
      eclipseTime: cell(row, "Waktu_Gerhana") || null,
      hilalAltitude: cell(row, "Hisab_Tinggi_Hilal_Deg") || null,
    };
  });

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    const deleted = await prisma.imsakiyah.deleteMany({});
    const created = await prisma.imsakiyah.createMany({ data: records });

    console.log(`\nSelesai: ${deleted.count} baris lama dihapus, ${created.count} baris diimpor.`);
    console.log(`Rentang tanggal: ${records[0]?.gregorianDate.toISOString().slice(0, 10)} s.d. ` +
      `${records[records.length - 1]?.gregorianDate.toISOString().slice(0, 10)}`);
    console.log(`Lokasi: ${records[0]?.city}, ${records[0]?.province}`);

    if (warnings.length > 0) {
      console.log(`\nPerhatian (${warnings.length}):`);
      for (const w of warnings) console.log(`  - ${w}`);
    } else {
      console.log("\nTidak ada nilai mencurigakan.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
