import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const PERMISSIONS = [
  { name: "View Prayer Time", slug: "falak.prayer-time.view" },
  { name: "Generate Prayer Time", slug: "falak.prayer-time.generate" },
  { name: "View Qibla", slug: "falak.qibla.view" },
  { name: "Calculate Qibla", slug: "falak.qibla.calculate" },
  { name: "View Hijri", slug: "falak.hijri.view" },
  { name: "Generate Hijri", slug: "falak.hijri.generate" },
  { name: "View Hisab", slug: "falak.hisab.view" },
  { name: "Calculate Hisab", slug: "falak.hisab.calculate" },
  { name: "Archive Hisab", slug: "falak.hisab.archive" },
  { name: "View Rukyat", slug: "falak.rukyat.view" },
  { name: "Create Rukyat", slug: "falak.rukyat.create" },
  { name: "Verify Rukyat", slug: "falak.rukyat.verify" },
  { name: "Confirm Rukyat", slug: "falak.rukyat.confirm" },
  { name: "Archive Rukyat", slug: "falak.rukyat.archive" },
  { name: "View Eclipse", slug: "falak.eclipse.view" },
  { name: "Calculate Eclipse", slug: "falak.eclipse.calculate" },
];

async function main() {
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
    console.log(`✓ ${perm.slug}`);
  }

  console.log(`\nDone — ${PERMISSIONS.length} permissions seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
