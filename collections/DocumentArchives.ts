import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadContent } from "./access";

export const DocumentArchives: CollectionConfig = {
  slug: "document-archives",
  dbName: "payload_document_archives",
  admin: {
    useAsTitle: "archiveNumber",
    description: "Arsip dokumen (read-only).",
  },
  access: {
    read: canReadContent,
    create: canManageSecretariat,
    update: canManageSecretariat,
    delete: canManageSecretariat,
  },
  fields: [
    {
      name: "archiveNumber",
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
      name: "documentType",
      type: "select",
      required: true,
      options: [
        { label: "Undangan", value: "UNDANGAN" },
        { label: "Permohonan", value: "PERMOHONAN" },
        { label: "Pemberitahuan", value: "PEMBERITAHUAN" },
        { label: "Instruksi", value: "INSTRUKSI" },
        { label: "Keterangan", value: "KETERANGAN" },
        { label: "Keputusan", value: "KEPUTUSAN" },
        { label: "Terima Kasih", value: "TERIMA_KASIH" },
        { label: "Lainnya", value: "LAINNYA" },
      ],
    },
    {
      name: "category",
      type: "text",
    },
    {
      name: "retentionYear",
      type: "number",
    },
    {
      name: "archivedAt",
      type: "date",
      required: true,
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};