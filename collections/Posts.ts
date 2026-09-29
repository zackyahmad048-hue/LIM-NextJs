import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Posts: CollectionConfig = {
  slug: "posts",
  // avoid clash with Prisma "posts" table on shared Neon DB
  dbName: "payload_posts",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "title",
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
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "thumbnail",
      type: "text",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
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
