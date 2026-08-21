import { PrismaClient } from "./generated/client/index.js";

const prisma = new PrismaClient();

try {
  const total = await prisma.wajibKhidmahMember.count();
  const sample = await prisma.wajibKhidmahMember.findMany({
    take: 5,
    select: {
      id: true,
      nama: true,
      asalDaerah: true,
      alamatLembaga: true,
      posWajibKhidmah: true,
      tempatWajibKhidmah: true,
      tugasKhidmah: true,
      status: true,
      keterangan: true,
      catatan: true,
      absensi: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log("Total anggota:", total);
  console.log("Sample 5 baris:");
  for (const row of sample) {
    console.log(JSON.stringify(row, null, 2));
  }
} catch (e) {
  console.error("ERROR:", e.message);
} finally {
  await prisma.$disconnect();
}
