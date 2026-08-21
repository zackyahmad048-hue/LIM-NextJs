import "dotenv/config";

import { prisma } from "@/modules/shared/infrastructure/prisma";

import { PERMISSIONS } from "@/config/permission";
import { ROLE_LABELS } from "@/config/role";
import {
  DEFAULT_PERMISSION_MATRIX,
  flattenPermissions,
} from "@/modules/authorization/application/permission.matrix";

const ALL_PERMISSION_SLUGS = flattenPermissions(PERMISSIONS);

interface SeedUnit {
  code: string;
  name: string;
  level: "PP" | "PW" | "PC";
  parentCode?: string;
}

const BIDANG_PP = [
  "Safari Dakwah Rutinan",
  "Penelitian dan Pengembangan",
  "Safari Ramadan",
  "Pesantren Ramadan",
  "Dakwah Digital",
  "Wajib Khidmah",
  "Pemberdayaan Ekonomi",
  "Pendidikan dan Kaderisasi",
  "Kajian Karya Ilmiah",
];

const WILAYAH = [
  "Jawa Timur",
  "Jawa Tengah",
  "Daerah Istimewa Yogyakarta",
  "Jawa Barat",
  "Jabodetabek",
  "Banten",
  "Lampung",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Jambi",
  "Riau",
  "Sumatera Utara",
  "Aceh",
  "Kalimantan Timur",
  "Kalimantan Barat",
  "Bali",
];

function roman(n: number): string {
  const table: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of table) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

function buildStandardUnits(): SeedUnit[] {
  const units: SeedUnit[] = [{ code: "PP", name: "Pengurus Pusat", level: "PP" }];

  BIDANG_PP.forEach((name, index) => {
    units.push({
      code: `PP.${roman(index + 1)}`,
      name: `Bidang ${name}`,
      level: "PP",
      parentCode: "PP",
    });
  });

  WILAYAH.forEach((name, index) => {
    units.push({
      code: `PW.${roman(index + 1)}`,
      name: `Pengurus Wilayah ${name}`,
      level: "PW",
      parentCode: "PP",
    });
  });

  const cabangSeJawaTimur = [
    "Kediri", "Nganjuk", "Blitar", "Tulungagung", "Trenggalek", "Jombang",
    "Mojokerto", "Surabaya", "Sidoarjo", "Malang Raya", "Pasuruan",
    "Probolinggo", "Jember", "Lumajang", "Bondowoso & Situbondo",
    "Banyuwangi", "Ponorogo", "Magetan", "Ngawi", "Madiun", "Pacitan",
    "Bojonegoro", "Tuban", "Lamongan", "Bangkalan", "Sampang",
    "Pamekasan", "Sumenep",
  ];
  const cabangSeJawaTengah = [
    "Sragen", "Karanganyar", "Boyolali", "Wonogiri", "Klaten", "Rembang",
    "Blora", "Pati", "Grobogan", "Demak", "Kudus", "Jepara",
    "Semarang & Salatiga", "Kota Semarang", "Kendal", "Magelang",
    "Purworejo", "Temanggung", "Wonosobo", "Banjarnegara", "Kebumen",
    "Purbalingga", "Banyumas", "Cilacap", "Pekalongan", "Pemalang",
    "Batang", "Brebes", "Tegal",
  ];
  const cabangSeJawaBarat = [
    "Cirebon", "Indramayu", "Karawang - Purwakarta", "Subang", "Kuningan",
    "Priangan", "Priangan Timur", "Majalengka", "Cianjur", "Sukabumi",
  ];
  const cabangJabodetabek = [
    "Depok & Bogor", "Jakarta Timur & Pusat", "Jakarta Barat",
    "Jakarta Utara", "Jakarta Selatan", "Bekasi Raya", "Tangerang Raya",
  ];
  const cabangBanten = [
    "Kota Pandeglang", "Lebak", "Kota Serang", "Serang Barat",
    "Serang Timur", "Kab. Pandeglang", "Tangerang",
  ];
  const cabangLampung = [
    "Pringsewu", "Tanggamus", "Lampung Timur", "Lampung Selatan",
    "Tulang Bawang", "Pesawaran", "Lampung Tengah", "Way Kanan",
    "Mesuji", "Lampung Barat", "Lampung Utara", "Bandar Lampung",
    "Tulang Bawang Barat",
  ];
  const cabangSumateraSelatan = [
    "Ogan Komering Ilir", "Ogan Komering Ulu Timur", "Banyuasin",
    "Musi Banyuasin", "Ogan Komering Ulu", "Muara Enim", "Musirawas",
  ];
  const cabangDaerahLain = ["Lombok", "Batam", "Jambi Barat", "Jambi Timur"];

  const pushCabang = (parentIndex: number, names: string[]) => {
    names.forEach((name, index) => {
      units.push({
        code: `PC.${roman(parentIndex + 1)}.${index + 1}`,
        name: `Cabang ${name}`,
        level: "PC",
        parentCode: `PW.${roman(parentIndex + 1)}`,
      });
    });
  };

  pushCabang(0, cabangSeJawaTimur);
  pushCabang(1, cabangSeJawaTengah);
  pushCabang(3, cabangSeJawaBarat);
  pushCabang(4, cabangJabodetabek);
  pushCabang(5, cabangBanten);
  pushCabang(6, cabangLampung);
  pushCabang(7, cabangSumateraSelatan);

  cabangDaerahLain.forEach((name, index) => {
    units.push({
      code: `PC.XVIII.${index + 1}`,
      name: `Cabang ${name}`,
      level: "PC",
    });
  });

  return units;
}

async function seedOrganizationUnits() {
  const units = buildStandardUnits();
  const codeToId = new Map<string, string>();

  for (const unit of units) {
    const existing = await prisma.organizationUnit.findUnique({
      where: { code: unit.code },
      select: { id: true, name: true },
    });

    if (existing) {
      codeToId.set(unit.code, existing.id);
      continue;
    }

    const created = await prisma.organizationUnit.create({
      data: {
        code: unit.code,
        name: unit.name,
        level: unit.level,
      },
      select: { id: true },
    });
    codeToId.set(unit.code, created.id);
    console.log(`✓ unit ${unit.code} ${unit.name}`);
  }

  for (const unit of units) {
    if (!unit.parentCode) continue;
    const id = codeToId.get(unit.code);
    const parentId = codeToId.get(unit.parentCode);
    if (!id || !parentId) continue;
    const current = await prisma.organizationUnit.findUnique({
      where: { id },
      select: { parentId: true },
    });
    if (current?.parentId !== parentId) {
      await prisma.organizationUnit.update({
        where: { id },
        data: { parentId },
      });
    }
  }

  const total = await prisma.organizationUnit.count({ where: { deletedAt: null } });
  console.log(`✓ struktur organisasi: ${total} unit`);
}

function grantsForRole(roleSlug: string): string[] {
  const grants = DEFAULT_PERMISSION_MATRIX[roleSlug];
  if (grants === "*") return ALL_PERMISSION_SLUGS;
  return grants;
}

async function main() {
  await seedOrganizationUnits();

  const slugToId = new Map<string, string>();

  for (const slug of ALL_PERMISSION_SLUGS) {
    const { id } = await prisma.permission.upsert({
      where: { slug },
      update: {},
      create: { name: slug, slug },
      select: { id: true },
    });
    slugToId.set(slug, id);
    console.log(`✓ permission ${slug}`);
  }

  for (const [roleSlug, roleName] of Object.entries(ROLE_LABELS)) {
    const role = await prisma.role.upsert({
      where: { slug: roleSlug },
      update: { name: roleName },
      create: { name: roleName, slug: roleSlug },
    });
    console.log(`✓ role ${roleSlug}`);

    const grantedSlugs = grantsForRole(roleSlug);
    for (const slug of grantedSlugs) {
      const permissionId = slugToId.get(slug);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId },
        },
        update: {},
        create: { roleId: role.id, permissionId },
      });
    }
    console.log(`✓ role ${roleSlug} → ${grantedSlugs.length} permissions`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (admin) {
      const superAdminRole = await prisma.role.findUnique({
        where: { slug: "super-admin" },
      });

      if (superAdminRole) {
        await prisma.userRole.upsert({
          where: {
            userId_roleId: { userId: admin.id, roleId: superAdminRole.id },
          },
          update: {},
          create: { userId: admin.id, roleId: superAdminRole.id },
        });
        console.log(`✓ admin ${adminEmail} → super-admin`);
      }
    } else {
      console.log(`! admin ${adminEmail} tidak ditemukan, role dilewati.`);
    }
  }

  console.log(
    `\nDone — ${ALL_PERMISSION_SLUGS.length} permissions, ${
      Object.keys(ROLE_LABELS).length
    } roles, RBAC ter-seed.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
