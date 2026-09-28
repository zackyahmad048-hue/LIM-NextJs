import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { PrismaUserPermissionRepository } from "../infrastructure/user-permission.repository";

export interface CurrentUserPermissions {
  userId: string | null;
  roleSlugs: string[];
  permissionSlugs: string[];
}

const repository = new PrismaUserPermissionRepository();

export async function getCurrentUserPermissions(): Promise<CurrentUserPermissions> {
  const session = await getSession();
  if (!session?.user?.id) {
    return { userId: null, roleSlugs: [], permissionSlugs: [] };
  }

  const { roleSlugs, permissionSlugs } = await repository.findSlugsByUserId(
    session.user.id,
  );

  return { userId: session.user.id, roleSlugs, permissionSlugs };
}
