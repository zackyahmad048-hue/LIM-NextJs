import type { Access, FieldAccess } from "payload";

import { PERMISSIONS } from "@/config/permission";
import type { PermissionSlug, RoleSlug } from "@/modules/authorization/application/permission.service";

/**
 * The admin panel authorises against Better Auth permission slugs, the same
 * namespace the custom dashboard uses. There is no role field on the `users`
 * collection: roles live in the Prisma RBAC graph and reach Payload through
 * `collections/better-auth.strategy.ts`, which attaches `roleSlugs` and
 * `permissionSlugs` to the authenticated user.
 */

type AuthenticatedUser = {
  roleSlugs?: unknown;
  permissionSlugs?: unknown;
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function roleSlugs(user: unknown): RoleSlug[] {
  if (!user || typeof user !== "object") return [];
  return toStringArray((user as AuthenticatedUser).roleSlugs);
}

function permissionSlugs(user: unknown): PermissionSlug[] {
  if (!user || typeof user !== "object") return [];
  return toStringArray((user as AuthenticatedUser).permissionSlugs);
}

function isAuthenticated(user: unknown): boolean {
  return roleSlugs(user).length > 0;
}

/**
 * Grants when the user holds at least one of the required permissions, or
 * when they hold a wildcard (`*`) that covers every permission.
 */
function canAny(user: unknown, required: PermissionSlug[]): boolean {
  const granted = permissionSlugs(user);

  if (granted.includes("*")) return true;
  if (granted.length === 0) return false;

  return required.some((permission) => granted.includes(permission));
}

const { CONTENT, FALAK, PROGRAM, TWK, SECRETARIAT, REPORTS, STRUCTURE, SYSTEM } =
  PERMISSIONS;

const { CATEGORY, POST } = CONTENT;

export const allowPublicRead: Access = () => true;

export const canReadContent: Access = ({ req }) => isAuthenticated(req.user);

export const canManageContent: Access = ({ req }) =>
  canAny(req.user, [POST.CREATE, POST.UPDATE, CATEGORY.CREATE, CATEGORY.UPDATE]);

export const canManageSecretariat: Access = ({ req }) =>
  canAny(req.user, [
    SECRETARIAT.INCOMING_MAIL.UPDATE,
    SECRETARIAT.OUTGOING_MAIL.UPDATE,
    SECRETARIAT.DISPOSITION.UPDATE,
    SECRETARIAT.DOCUMENT.UPDATE,
    SECRETARIAT.AGENDA.UPDATE,
  ]);

export const canManageProgram: Access = ({ req }) =>
  canAny(req.user, [PROGRAM.UPDATE, PROGRAM.SCHEDULE.UPDATE]);

export const canManageTwk: Access = ({ req }) =>
  canAny(req.user, [TWK.MEMBER.UPDATE]);

export const canManageFalak: Access = ({ req }) =>
  canAny(req.user, [FALAK.PRAYER_TIME.GENERATE, FALAK.RUKYAT.CREATE]);

export const canManageDriveConnections: Access = ({ req }) =>
  canAny(req.user, [REPORTS.SYNC]);

export const canManageUsers: Access = ({ req }) =>
  canAny(req.user, [SYSTEM.USER.UPDATE]);

export const canManageSettings: Access = ({ req }) =>
  canAny(req.user, [STRUCTURE.UPDATE]);

export const canManageUsersField: FieldAccess = ({ req }) =>
  canAny(req.user, [SYSTEM.USER.UPDATE]);

export const isSuperAdmin: FieldAccess = ({ req }) =>
  permissionSlugs(req.user).includes("*") || roleSlugs(req.user).includes("super-admin");
