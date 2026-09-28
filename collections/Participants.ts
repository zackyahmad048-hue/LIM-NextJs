import type { CollectionConfig } from "payload";

import { canManageProgram, canReadContent } from "./access";

export const Participants: CollectionConfig = {
  slug: "participants",
  dbName: "payload_participants",
  admin: {
    useAsTitle: "userId",
  },
  access: {
    read: canReadContent,
    create: canManageProgram,
    update: canManageProgram,
    delete: canManageProgram,
  },
  fields: [
    {
      name: "program",
      type: "relationship",
      relationTo: "programs",
      required: true,
    },
    {
      name: "userId",
      type: "text",
      required: true,
    },
    {
      name: "registrationDate",
      type: "date",
      required: true,
    },
    {
      name: "registrationStatus",
      type: "select",
      required: true,
      defaultValue: "PENDING",
      options: [
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};