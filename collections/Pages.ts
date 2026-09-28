import type { CollectionConfig } from "payload";

import { SITE_PAGES } from "@/config/site-pages";

import { allowPublicRead, canManageContent } from "./access";

const pageOptions = Object.values(SITE_PAGES).map((page) => ({
  label: `${page.title} (${page.route})`,
  value: page.key,
}));

export const Pages: CollectionConfig = {
  slug: "pages",
  // avoid clash with any Prisma table names on shared Neon DB
  dbName: "payload_pages",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "updatedAt"],
    description:
      "Konten halaman situs. Skema field per key ada di config/site-pages.ts.",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "key",
      type: "select",
      required: true,
      unique: true,
      options: pageOptions,
      admin: {
        description: "Identifier halaman (unik).",
      },
    },
    {
      name: "content",
      type: "json",
      required: true,
      admin: {
        description:
          "Nilai field halaman (teks, list, dll) sesuai skema di config/site-pages.ts.",
      },
    },
  ],
};
