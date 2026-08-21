export type PermissionSlug = string;

export type RoleSlug = string;

export type PermissionMatrix = Record<RoleSlug, PermissionSlug[] | "*">;

const WILDCARD = "*";

export function can(
  role: RoleSlug,
  permission: PermissionSlug,
  matrix: PermissionMatrix,
): boolean {
  if (!permission) return false;

  const grants = matrix[role];
  if (grants === undefined) return false;
  if (grants === WILDCARD) return true;

  return grants.includes(permission);
}

export function hasAnyPermission(
  roles: RoleSlug[],
  required: PermissionSlug[],
  matrix: PermissionMatrix,
): boolean {
  if (required.length === 0) return false;

  return required.some((permission) => roles.some((role) => can(role, permission, matrix)));
}

export function hasAllPermissions(
  roles: RoleSlug[],
  required: PermissionSlug[],
  matrix: PermissionMatrix,
): boolean {
  if (roles.length === 0 && required.length > 0) return false;

  return required.every((permission) =>
    roles.some((role) => can(role, permission, matrix)),
  );
}
