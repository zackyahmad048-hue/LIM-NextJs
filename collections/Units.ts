import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Units: CollectionConfig = {
  slug: "units",
  dbName: "payload_units",
  admin: {
    useAsTitle: "code",
    description: "Struktur organisasi: PP, PW, dan PC (Pendataan).",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "level",
      type: "select",
      required: true,
      options: [
        { label: "Pengurus Pusat", value: "PP" },
        { label: "Pengurus Wilayah", value: "PW" },
        { label: "Pengurus Cabang", value: "PC" },
      ],
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "units",
      label: "Induk",
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};