export const ROLES = {
  SUPER_ADMIN: "super-admin",

  ADMINISTRATOR: "administrator",

  EDITOR: "editor",

  OPERATOR: "operator",

  VIEWER: "viewer",
} as const;

export type Role =
  (typeof ROLES)[keyof typeof ROLES];