import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageProgram } from "./access";

export const ProgramSchedules: CollectionConfig = {
  slug: "program-schedules",
  dbName: "payload_program_schedules",
  admin: {
    useAsTitle: "title",
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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "venueId",
      type: "text",
    },
    {
      name: "startTime",
      type: "date",
      required: true,
    },
    {
      name: "endTime",
      type: "date",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};