import type { GlobalConfig } from "payload";

import { canManageSettings, isSuperAdmin } from "@/collections/access";

export const Settings: GlobalConfig = {
  slug: "settings",
  // avoid clash with Prisma "settings" table on shared Neon DB
  dbName: "payload_settings",
  access: {
    read: () => true,
    update: canManageSettings,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "Lembaga Ittihadul Muballighin",
    },
    {
      name: "siteDescription",
      type: "textarea",
    },
    {
      name: "numbering",
      type: "group",
      label: "Penomoran Surat",
      access: {
        create: isSuperAdmin,
        update: isSuperAdmin,
      },
      fields: [
        {
          name: "formatTemplate",
          type: "text",
          admin: {
            description:
              "Template format nomor surat keluar (placeholder: {seq}, {level}, {category}, {bulan}, {tahun}).",
          },
        },
        {
          name: "sequenceDigits",
          type: "number",
          admin: {
            description: "Jumlah digit nomor urut (padding, mis. 3 => 001).",
          },
        },
        {
          name: "periods",
          type: "array",
          label: "Periode Kepengurusan",
          fields: [
            {
              name: "startYear",
              type: "number",
              required: true,
            },
            {
              name: "endYear",
              type: "number",
              required: true,
            },
          ],
        },
        {
          name: "levelCodes",
          type: "array",
          label: "Kode Tingkat Kepengurusan",
          fields: [
            {
              name: "code",
              type: "text",
              required: true,
            },
            {
              name: "label",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "nextSequence",
          type: "json",
          admin: {
            description:
              'Override nomor urut berikutnya per periode ({"periodYear": n}).',
          },
        },
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Hero Beranda",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "title", type: "text" },
        { name: "highlight", type: "text" },
        { name: "tagline", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "text" },
        { name: "ctaLabel", type: "text" },
        { name: "ctaHref", type: "text" },
        { name: "secondaryLabel", type: "text" },
        { name: "secondaryHref", type: "text" },
        {
          name: "statCards",
          type: "array",
          fields: [
            { name: "value", type: "text" },
            { name: "label", type: "text" },
          ],
        },
      ],
    },
  ],
};
