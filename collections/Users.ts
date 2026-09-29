import type { CollectionAfterMeHook, CollectionConfig } from "payload";

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
  hooks: {
    /**
     * The admin panel resolves the signed-in user through `/users/me`, which
     * re-reads the document with `overrideAccess: false`. That means the
     * collection-level `read` rule decides whether the panel knows who you
     * are, so an `editor` or `sekretaris` would get `user: null` and be
     * bounced to a login page that has no form.
     *
     * `access.read` still governs the list view and document access, so
     * managing users stays restricted to `system.user.update` holders. This
     * hook only restores self-identification for already-authenticated users.
     */
    afterMe: [
      (({ req, response }: { req: any; response: any }) => {
        const reqUser = req?.user as Record<string, unknown> | null | undefined;

        if (!reqUser || response?.user) return;

        response.user = {
          ...reqUser,
          collection: "users",
        };
      }) satisfies CollectionAfterMeHook,
    ],
  },
  fields: [
    {
      name: "authUserId",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "Better Auth user id. Provisioned by the auth strategy.",
      },
    },
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
