import "dotenv/config";

import { prisma } from "@/modules/shared/infrastructure/prisma";

import { PERMISSIONS } from "@/config/permission";
import { ROLE_LABELS } from "@/config/role";
import {
  DEFAULT_PERMISSION_MATRIX,
  flattenPermissions,
} from "@/modules/authorization/application/permission.matrix";

const ALL_PERMISSION_SLUGS = flattenPermissions(PERMISSIONS);

function grantsForRole(roleSlug: string): string[] {
  const grants = DEFAULT_PERMISSION_MATRIX[roleSlug];
  if (grants === "*") return ALL_PERMISSION_SLUGS;
  return grants;
}

async function main() {
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
