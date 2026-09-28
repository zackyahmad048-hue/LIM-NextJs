import type { CollectionConfig } from "payload";

import { canManageUsers, canManageUsersField } from "./access";
import { betterAuthStrategy } from "./better-auth.strategy";

export const Users: CollectionConfig = {
  slug: "users",
  // avoid clash with Prisma "user" table on shared Neon DB (keeps plural)
  dbName: "payload_users",
  auth: {
    // Better Auth owns sessions and the RBAC graph. Payload must not keep a
    // second password store, so the local login form is disabled and the
    // admin panel relies entirely on the delegated strategy.
    disableLocalStrategy: true,
    strategies: [betterAuthStrategy],
  },
  admin: {
    useAsTitle: "email",
    group: "System",
  },
  access: {
    read: canManageUsers,
    create: canManageUsers,
    update: canManageUsers,
    delete: canManageUsers,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      access: {
        create: canManageUsersField,
        update: canManageUsersField,
      },
    },
  ],
};
