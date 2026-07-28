// Authorization Module — barrel exports

// Domain
export { Role } from "./domain/role.entity";
export { Permission } from "./domain/permission.entity";

// Application
export { createRole } from "./application/create-role";
export { getRoles, getRoleById, getRoleBySlug } from "./application/get-roles";

// Infrastructure
export { PrismaRoleRepository } from "./infrastructure/role.repository";

// Presentation
export { createRoleAction } from "./presentation/role.action";
export { getRoles as getRolesQuery, getRoleById as getRoleByIdQuery, getRoleBySlug as getRoleBySlugQuery } from "./presentation/role.query";

// Validators
export { roleSchema } from "./validations/role.schema";
export type { RoleSchema } from "./validations/role.schema";
