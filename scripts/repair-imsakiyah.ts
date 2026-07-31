// Perbaiki data Imsakiyah hasil import yang bergeser karena kolom nyasar di sheet.
//
// Sheet "Template Database Imsakiyah" memiliki sel nyasar "1.068.272" di kolom
// Imsak sehingga semua nilai waktu shalat & fase bulan bergeser satu kolom.
// Script ini menerapkan pemetaan yang sudah diverifikasi:
//   lat = -6.1754, lng = 106.8272 (sesuai Link_Google_Maps q=-6.1754)
//   Imsak <- Subuh, Subuh <- Terbit, Terbit <- Dhuha, Dhuha <- Dzuhur,
//   Dzuhur <- Ashar, Ashar <- Maghrib, Maghrib <- Isya, Isya <- Fase_Bulan,
//   Fase_Bulan <- Data_Gerhana, Data_Gerhana <- Waktu_Gerhana,
//   Waktu_Gerhana <- Hisab_Tinggi_Hilal_Deg, Hisab_Tinggi_Hilal_Deg = null
//
// Cara pakai:  npm run repair:imsakiyah

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client";

const TIME_RE = /^\d{1,2}:\d{2}(:\d{2})?$/;

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  try {
    const rows = await prisma.imsakiyah.findMany({ orderBy: { no: "asc" } });
    if (rows.length === 0) {
      console.log("Tabel imsakiyah kosong, tidak ada yang diperbaiki.");
      return;
    }

    let shifted = 0;
    let geofixed = 0;

    for (const row of rows) {
      const needsShift = TIME_RE.test(row.moonPhase ?? "");
      if (needsShift) {
        const patch = {
          imsak: row.subuh,
          subuh: row.terbit,
          terbit: row.dhuha,
          dhuha: row.dzuhur,
          dzuhur: row.ashar,
          ashar: row.maghrib,
          maghrib: row.isya,
          isya: row.moonPhase ?? "",
          moonPhase: row.eclipseData,
          eclipseData: row.eclipseTime,
          eclipseTime: row.hilalAltitude,
          hilalAltitude: null,
        };
        await prisma.imsakiyah.update({ where: { id: row.id }, data: patch });
        shifted++;
      }

      if (row.latitude !== -6.1754 || row.longitude !== 106.8272) {
        await prisma.imsakiyah.update({
          where: { id: row.id },
          data: { latitude: -6.1754, longitude: 106.8272 },
        });
        geofixed++;
      }
    }

    const sample = await prisma.imsakiyah.findMany({
      orderBy: { no: "asc" },
      take: 2,
      select: {
        no: true,
        latitude: true,
        longitude: true,
        imsak: true,
        subuh: true,
        terbit: true,
        dhuha: true,
        dzuhur: true,
        ashar: true,
        maghrib: true,
        isya: true,
        moonPhase: true,
        eclipseData: true,
        eclipseTime: true,
      },
    });
    console.log(`Selesai: ${shifted} baris di-shift, ${geofixed} baris diperbaiki koordinatnya.`);
    console.log(JSON.stringify(sample, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
