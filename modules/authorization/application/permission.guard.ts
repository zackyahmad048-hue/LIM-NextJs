import { getCurrentUserPermissions } from "../queries/current-user-permission.query";
import { hasAnyPermission } from "./permission.service";
import { DEFAULT_PERMISSION_MATRIX } from "./permission.matrix";
import type { PermissionMatrix, PermissionSlug } from "./permission.service";

export function assertPermissions(
  roleSlugs: string[],
  required: PermissionSlug[],
  matrix: PermissionMatrix,
): void {
  if (roleSlugs.length === 0) {
    throw new Error("UNAUTHORIZED");
  }

  if (required.length === 0) return;

  if (!hasAnyPermission(roleSlugs, required, matrix)) {
    throw new Error("FORBIDDEN");
  }
}

export async function requireSessionWithPermissions(
  required: PermissionSlug[],
  matrix: PermissionMatrix = DEFAULT_PERMISSION_MATRIX,
): Promise<{
  user: { id: string };
  roleSlugs: string[];
  permissionSlugs: string[];
}> {
  const current = await getCurrentUserPermissions();
  assertPermissions(current.roleSlugs, required, matrix);

  if (!current.userId) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    user: { id: current.userId },
    roleSlugs: current.roleSlugs,
    permissionSlugs: current.permissionSlugs,
  };
}
