import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageProgram } from "./access";

export const ProgramCommittees: CollectionConfig = {
  slug: "program-committees",
  dbName: "payload_program_committees",
  admin: {
    useAsTitle: "role",
  },
  access: {
    read: allowPublicRead,
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
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "ACTIVE",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};