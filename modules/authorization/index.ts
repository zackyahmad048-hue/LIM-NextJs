// Authorization Module — barrel exports

// Domain
export { Role } from "./domain/role.entity";
export { Permission } from "./domain/permission.entity";

// Application
export { createRole } from "./application/create-role";
export { getRoles, getRoleById, getRoleBySlug } from "./application/get-roles";
export {
  can,
  hasAnyPermission,
  hasAllPermissions,
} from "./application/permission.service";
export type { PermissionMatrix, PermissionSlug, RoleSlug } from "./application/permission.service";
export {
  DEFAULT_PERMISSION_MATRIX,
  flattenPermissions,
} from "./application/permission.matrix";
export {
  assertPermissions,
  requireSessionWithPermissions,
} from "./application/permission.guard";
export { filterNavigation } from "./application/permission-nav";

// Queries
export { getCurrentUserPermissions } from "./queries/current-user-permission.query";
export type { CurrentUserPermissions } from "./queries/current-user-permission.query";

// Infrastructure
export { PrismaRoleRepository } from "./infrastructure/role.repository";

// Presentation
export { createRoleAction } from "./presentation/role.action";
export {
  getRoles as getRolesQuery,
  getRoleById as getRoleByIdQuery,
  getRoleBySlug as getRoleBySlugQuery,
} from "./presentation/role.query";

// Validators
export { roleSchema } from "./validations/role.schema";
export type { RoleSchema } from "./validations/role.schema";
