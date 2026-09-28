import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Bidang: CollectionConfig = {
  slug: "bidangs",
  // avoid clash with any legacy table on shared Neon DB
  dbName: "payload_bidangs",
  admin: {
    useAsTitle: "title",
    description: "Bidang-bidang kegiatan yang ditampilkan pada halaman profil.",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "tagline",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "points",
      type: "array",
      label: "Poin Kegiatan",
      fields: [
        {
          name: "value",
          type: "text",
        },
      ],
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Urutan",
      defaultValue: 0,
    },
  ],
};