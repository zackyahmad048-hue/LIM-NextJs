export const ROLES = {
  SUPER_ADMIN: "super-admin",

  ADMINISTRATOR: "administrator",

  EDITOR: "editor",

  OPERATOR: "operator",

  SEKRETARIS: "sekretaris",

  VIEWER: "viewer",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMINISTRATOR]: "Administrator",
  [ROLES.EDITOR]: "Editor",
  [ROLES.OPERATOR]: "Operator",
  [ROLES.SEKRETARIS]: "Sekretaris",
  [ROLES.VIEWER]: "Viewer",
};
