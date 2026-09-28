import type { CollectionConfig } from "payload";

import { canManageProgram, canReadContent } from "./access";

export const Attendances: CollectionConfig = {
  slug: "attendances",
  dbName: "payload_attendances",
  admin: {
    useAsTitle: "participant",
  },
  access: {
    read: canReadContent,
    create: canManageProgram,
    update: canManageProgram,
    delete: canManageProgram,
  },
  fields: [
    {
      name: "participant",
      type: "relationship",
      relationTo: "participants",
      required: true,
    },
    {
      name: "checkIn",
      type: "date",
    },
    {
      name: "checkOut",
      type: "date",
    },
    {
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Present", value: "PRESENT" },
        { label: "Absent", value: "ABSENT" },
        { label: "Late", value: "LATE" },
        { label: "Excused", value: "EXCUSED" },
      ],
    },
  ],
};