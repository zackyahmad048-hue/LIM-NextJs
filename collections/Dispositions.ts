import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadSecretariat } from "./access";

export const Dispositions: CollectionConfig = {
  slug: "dispositions",
  dbName: "payload_dispositions",
  admin: {
    useAsTitle: "instruction",
    description: "Disposisi surat masuk.",
  },
  access: {
    read: canReadSecretariat,
    create: canManageSecretariat,
    update: canManageSecretariat,
    delete: canManageSecretariat,
  },
  fields: [
    {
      name: "incomingMail",
      type: "relationship",
      relationTo: "incoming-mails",
      required: true,
    },
    {
      name: "assignedToId",
      type: "text",
      required: true,
    },
    {
      name: "instruction",
      type: "textarea",
      required: true,
    },
    {
      name: "priority",
      type: "text",
      required: true,
      defaultValue: "NORMAL",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "PENDING",
      options: [
        { label: "Menunggu", value: "PENDING" },
        { label: "Diproses", value: "IN_PROGRESS" },
        { label: "Selesai", value: "COMPLETED" },
        { label: "Dibatalkan", value: "CANCELLED" },
      ],
    },
    {
      name: "dueDate",
      type: "date",
    },
    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};