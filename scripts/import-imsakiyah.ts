// CLI wrapper untuk impor Imsakiyah dari Google Sheet.
//
// Logika inti ada di modules/falak/application/import-imsakiyah.ts dan dipakai
// juga oleh aksi admin (tombol "Import dari Google Sheets").
//
// Cara pakai:
//   1. Isi .env dengan DATABASE_URL dan kredensial Google Sheet
//      (GOOGLE_SHEET_ID + GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY, atau varian
//      GOOGLE_SPREADSHEET_FALAK_ID + GOOGLE_SERVICE_ACCOUNT_*).
//   2. Jalankan:  npm run import:imsakiyah

import "dotenv/config";

import { importImsakiyahFromSheet } from "@/modules/falak/application/import-imsakiyah";

async function main() {
  const result = await importImsakiyahFromSheet();

  console.log(`\nSelesai: ${result.deleted} baris lama dihapus, ${result.imported} baris diimpor.`);
  if (result.dateStart && result.dateEnd) {
    console.log(`Rentang tanggal: ${result.dateStart} s.d. ${result.dateEnd}`);
  }
  if (result.location) {
    console.log(`Lokasi: ${result.location}`);
  }

  if (result.warnings.length > 0) {
    console.log(`\nPerhatian (${result.warnings.length}):`);
    for (const warning of result.warnings) console.log(`  - ${warning}`);
  } else {
    console.log("\nTidak ada nilai mencurigakan.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
