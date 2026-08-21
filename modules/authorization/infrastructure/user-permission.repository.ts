import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type {
  UserPermissionRepository,
  UserPermissionSlugs,
} from "../domain/user-permission.repository";

export class PrismaUserPermissionRepository
  extends BaseRepository
  implements UserPermissionRepository
{
  async findSlugsByUserId(userId: string): Promise<UserPermissionSlugs> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
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
      return { roleSlugs: [], permissionSlugs: [] };
    }

    const roleSlugs = user.userRoles.map((userRole) => userRole.role.slug);
    const permissionSlugs = Array.from(
      new Set(
        user.userRoles.flatMap((userRole) =>
          userRole.role.rolePermissions.map(
            (rolePermission) => rolePermission.permission.slug,
          ),
        ),
      ),
    );

    return { roleSlugs, permissionSlugs };
  }
}
