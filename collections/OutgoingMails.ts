import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadSecretariat } from "./access";

export const OutgoingMails: CollectionConfig = {
  slug: "outgoing-mails",
  dbName: "payload_outgoing_mails",
  admin: {
    useAsTitle: "registrationNumber",
    description: "Surat keluar sekretariat.",
  },
  access: {
    read: canReadSecretariat,
    create: canManageSecretariat,
    update: canManageSecretariat,
    delete: canManageSecretariat,
  },
  fields: [
    {
      name: "registrationNumber",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "recipient",
      type: "text",
    },
    {
      name: "subject",
      type: "text",
      required: true,
    },
    {
      name: "senderName",
      type: "text",
    },
    {
      name: "mailDate",
      type: "date",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "DRAFT",
      options: [
        { label: "Draf", value: "DRAFT" },
        { label: "Terkirim", value: "SENT" },
        { label: "Diarsipkan", value: "ARCHIVED" },
      ],
    },
    {
      name: "documentType",
      type: "select",
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
      name: "categoryCode",
      type: "text",
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "sentAt",
      type: "date",
    },
    {
      name: "archivedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "sequence",
      type: "number",
    },
    {
      name: "levelCode",
      type: "text",
    },
    {
      name: "romanMonth",
      type: "text",
    },
    {
      name: "periodYear",
      type: "number",
    },
    {
      name: "fullNumber",
      type: "text",
      unique: true,
    },
    {
      name: "verificationCode",
      type: "text",
      unique: true,
    },
    {
      name: "qrFileId",
      type: "text",
    },
    {
      name: "attachmentUrl",
      type: "text",
    },
    {
      name: "ketuaName",
      type: "text",
    },
    {
      name: "ketuaPosition",
      type: "text",
    },
    {
      name: "sekretarisName",
      type: "text",
    },
    {
      name: "sekretarisPosition",
      type: "text",
    },
    {
      name: "qrKetuaPosition",
      type: "json",
    },
    {
      name: "qrSekretarisPosition",
      type: "json",
    },
    {
      name: "qrVerifikasiPosition",
      type: "json",
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};