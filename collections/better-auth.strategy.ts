import type { AuthStrategy } from "payload";

import { auth } from "@/modules/authentication/infrastructure/better-auth";
import { PrismaUserPermissionRepository } from "@/modules/authorization/infrastructure/user-permission.repository";

const permissionRepository = new PrismaUserPermissionRepository();

/**
 * Payload is the CMS data layer, not the identity provider. Better Auth owns
 * sessions and the RBAC graph (User -> UserRole -> Role -> RolePermission).
 *
 * This strategy resolves the Better Auth session, then returns the matching
 * `users` document with the caller's role and permission slugs attached, so
 * `collections/access.ts` can authorise against permission slugs instead of a
 * role field that Better Auth never populates.
 *
 * The `users` document is provisioned on first sight of an email so that
 * `req.user.id` stays a valid `users` id. Payload keys admin preferences and
 * locked documents by that id.
 */
export const betterAuthStrategy: AuthStrategy = {
  name: "better-auth",
  authenticate: async ({ headers, payload }) => {
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      return { user: null };
    }

    const { roleSlugs, permissionSlugs } =
      await permissionRepository.findSlugsByUserId(session.user.id);

    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: session.user.email } },
      limit: 1,
      depth: 0,
    });

    const user = existing.docs[0]
      ? await payload.update({
          collection: "users",
          id: existing.docs[0].id,
          data: { name: session.user.name ?? undefined },
          depth: 0,
        })
      : await payload.create({
          collection: "users",
          data: {
            email: session.user.email,
            name: session.user.name ?? undefined,
          },
          depth: 0,
        });

    return {
      user: {
        ...user,
        roleSlugs,
        permissionSlugs,
      },
    };
  },
};
