import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface CurrentUserPermissions {
  userId: string | null;
  roleSlugs: string[];
  permissionSlugs: string[];
}

export async function getCurrentUserPermissions(): Promise<CurrentUserPermissions> {
  const session = await getSession();
  if (!session?.user?.id) {
    return { userId: null, roleSlugs: [], permissionSlugs: [] };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: { select: { slug: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return { userId: session.user.id, roleSlugs: [], permissionSlugs: [] };
  }

  const roleSlugs = user.userRoles.map((userRole) => userRole.role.slug);
  const permissionSlugs = Array.from(
    new Set(
      user.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.slug),
      ),
    ),
  );

  return { userId: user.id, roleSlugs, permissionSlugs };
}
