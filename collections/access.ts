import type { Access, FieldAccess } from "payload";

export type PayloadRole =
  | "super-admin"
  | "administrator"
  | "editor"
  | "operator"
  | "sekretaris"
  | "viewer";

const ADMIN_ROLES: PayloadRole[] = ["super-admin", "administrator"];

const CONTENT_MANAGER_ROLES: PayloadRole[] = [
  "super-admin",
  "administrator",
  "editor",
];

const SECRETARIAT_MANAGER_ROLES: PayloadRole[] = [
  ...CONTENT_MANAGER_ROLES,
  "sekretaris",
];

const PROGRAM_MANAGER_ROLES: PayloadRole[] = [
  ...CONTENT_MANAGER_ROLES,
  "operator",
];

function userRoles(user: unknown): PayloadRole[] {
  if (!user || typeof user !== "object") return [];
  const role = (user as { role?: string }).role;
  return role && isValidRole(role) ? [role] : [];
}

function isValidRole(role: string): role is PayloadRole {
  return ADMIN_ROLES.some((r) => r === role) || role === "editor" || role === "operator" || role === "sekretaris" || role === "viewer";
}

function hasAnyRole(user: unknown, roles: PayloadRole[]): boolean {
  return userRoles(user).some((role) => roles.includes(role));
}

export const allowPublicRead: Access = () => true;

export const canReadContent: Access = ({ req }) =>
  req.user != null && userRoles(req.user).length > 0;

export const canManageContent: Access = ({ req }) =>
  hasAnyRole(req.user, CONTENT_MANAGER_ROLES);

export const canManageSecretariat: Access = ({ req }) =>
  hasAnyRole(req.user, SECRETARIAT_MANAGER_ROLES);

export const canManageProgram: Access = ({ req }) =>
  hasAnyRole(req.user, PROGRAM_MANAGER_ROLES);

export const canManageTwk: Access = ({ req }) =>
  hasAnyRole(req.user, PROGRAM_MANAGER_ROLES);

export const canManageFalak: Access = ({ req }) =>
  hasAnyRole(req.user, PROGRAM_MANAGER_ROLES);

export const canManageDriveConnections: Access = ({ req }) =>
  hasAnyRole(req.user, ["super-admin"]);

export const canManageUsers: Access = ({ req }) =>
  hasAnyRole(req.user, ADMIN_ROLES);

export const canManageSettings: Access = ({ req }) =>
  hasAnyRole(req.user, ADMIN_ROLES);

export const canManageRoleField: FieldAccess = ({ req }) =>
  hasAnyRole(req.user, ADMIN_ROLES);

export const isSuperAdmin: FieldAccess = ({ req }) => {
  const roles = userRoles(req.user);
  return roles.includes("super-admin");
};