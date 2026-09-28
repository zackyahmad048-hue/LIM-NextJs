import type { CollectionConfig } from "payload";

import { canManageRoleField, canManageUsers } from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  // avoid clash with Prisma "user" table on shared Neon DB (keeps plural)
  dbName: "payload_users",
  auth: true,
  admin: {
    useAsTitle: "email",
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
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      access: {
        create: canManageRoleField,
        update: canManageRoleField,
      },
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "Administrator", value: "administrator" },
        { label: "Editor", value: "editor" },
        { label: "Operator", value: "operator" },
        { label: "Sekretaris", value: "sekretaris" },
        { label: "Viewer", value: "viewer" },
      ],
    },
  ],
};
