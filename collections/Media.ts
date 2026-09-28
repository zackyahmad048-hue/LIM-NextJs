import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Media: CollectionConfig = {
  slug: "media",
  // avoid clash with Prisma "media" table on shared Neon DB
  dbName: "payload_media",
  admin: {
    useAsTitle: "originalName",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "originalName",
      type: "text",
      required: true,
    },
    {
      name: "mimeType",
      type: "text",
      required: true,
    },
    {
      name: "size",
      type: "number",
      required: true,
    },
    {
      name: "url",
      type: "text",
    },
    {
      name: "access",
      type: "select",
      defaultValue: "private",
      options: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
    },
    {
      name: "fileId",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "folder",
      type: "text",
      required: true,
    },
    {
      name: "storageProvider",
      type: "select",
      required: true,
      defaultValue: "BLOB",
      options: [
        { label: "Vercel Blob", value: "BLOB" },
        { label: "Google Drive", value: "GOOGLE_DRIVE" },
      ],
    },
    {
      name: "storageKey",
      type: "text",
    },
    {
      name: "uploadedById",
      type: "text",
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};