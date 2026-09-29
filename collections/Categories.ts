import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Categories: CollectionConfig = {
  slug: "categories",
  // avoid clash with Prisma "categories" table on shared Neon DB
  dbName: "payload_categories",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "deletedAt",
      type: "date",
      admin: {
        hidden: true,
        description: "Soft delete timestamp. Non-null means archived.",
      },
    },
  ],
};
