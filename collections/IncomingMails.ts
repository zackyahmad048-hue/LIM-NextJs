import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadSecretariat } from "./access";

export const IncomingMails: CollectionConfig = {
  slug: "incoming-mails",
  dbName: "payload_incoming_mails",
  admin: {
    useAsTitle: "registrationNumber",
    description: "Surat masuk sekretariat.",
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
      name: "sender",
      type: "text",
      required: true,
    },
    {
      name: "subject",
      type: "text",
      required: true,
    },
    {
      name: "senderAddress",
      type: "text",
    },
    {
      name: "receivedDate",
      type: "date",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "RECEIVED",
      options: [
        { label: "Diterima", value: "RECEIVED" },
        { label: "Diproses", value: "PROCESSED" },
        { label: "Diarsipkan", value: "ARCHIVED" },
      ],
    },
    {
      name: "classification",
      type: "text",
    },
    {
      name: "category",
      type: "text",
    },
    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "attachmentUrl",
      type: "text",
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