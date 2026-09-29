import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadSecretariat } from "./access";

export const AdministrativeDocuments: CollectionConfig = {
  slug: "administrative-documents",
  dbName: "payload_administrative_documents",
  admin: {
    useAsTitle: "title",
    description: "Dokumen administrasi sekretariat.",
  },
  access: {
    read: canReadSecretariat,
    create: canManageSecretariat,
    update: canManageSecretariat,
    delete: canManageSecretariat,
  },
  fields: [
    {
      name: "documentNumber",
      type: "text",
      required: true,
      unique: true,
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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "attachmentUrl",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "DRAFT",
      options: [
        { label: "Draf", value: "DRAFT" },
        { label: "Diajukan", value: "SUBMITTED" },
        { label: "Disetujui", value: "APPROVED" },
        { label: "Ditolak", value: "REJECTED" },
        { label: "Diarsipkan", value: "ARCHIVED" },
      ],
    },
    {
      name: "submittedById",
      type: "text",
    },
    {
      name: "submittedAt",
      type: "date",
    },
    {
      name: "approvedById",
      type: "text",
    },
    {
      name: "approvedAt",
      type: "date",
    },
    {
      name: "archivedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};