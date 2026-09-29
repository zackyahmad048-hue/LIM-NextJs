import type { AuthStrategy } from "payload";

import { auth } from "@/modules/authentication/infrastructure/better-auth";
import { PrismaUserPermissionRepository } from "@/modules/authorization/infrastructure/user-permission.repository";

const permissionRepository = new PrismaUserPermissionRepository();

/**
 * Payload is the CMS data layer, not the identity provider. Better Auth owns
 * sessions and the RBAC graph (User -> UserRole -> Role -> RolePermission).
 *
 * This strategy resolves the Better Auth session and returns the matching
 * `users` document with the caller's role and permission slugs attached, so
 * `collections/access.ts` can authorise against permission slugs instead of a
 * role field Better Auth never populates.
 *
 * The `users` document is keyed on `authUserId` (the Better Auth user id) and
 * provisioned on first sight. Payload keys admin preferences and locked
 * documents by that document's id, so a stable id matters. Keying on the
 * Better Auth id rather than the email also means an email change does not
 * orphan the old document.
 *
 * This runs on every authenticated Payload request, including each admin
 * server function, so it must not write on the happy path.
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
      where: { authUserId: { equals: session.user.id } },
      limit: 1,
      depth: 0,
    });

    const found = existing.docs[0];

    if (found) {
      // Only write when the display name actually drifted, so the common case
      // stays a read.
      const name = session.user.name ?? undefined;
      const nameChanged = name != null && found.name !== name;

      if (nameChanged) {
        const updated = await payload.update({
          collection: "users",
          id: found.id,
          data: { name },
          depth: 0,
        });

        return { user: { ...updated, roleSlugs, permissionSlugs } };
      }

      return { user: { ...found, roleSlugs, permissionSlugs } };
    }

    // Provision on first sight. A concurrent request can win the unique index
    // on authUserId between our find and create, so fall back to re-reading.
    try {
      const created = await payload.create({
        collection: "users",
        data: {
          authUserId: session.user.id,
          email: session.user.email,
          name: session.user.name ?? undefined,
        },
        depth: 0,
      });

      return { user: { ...created, roleSlugs, permissionSlugs } };
    } catch (error) {
      const raced = await payload.find({
        collection: "users",
        where: { authUserId: { equals: session.user.id } },
        limit: 1,
        depth: 0,
      });

      if (raced.docs[0]) {
        return {
          user: { ...raced.docs[0], roleSlugs, permissionSlugs },
        };
      }

      throw error;
    }
  },
};
