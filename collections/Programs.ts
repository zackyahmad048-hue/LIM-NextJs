import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageProgram } from "./access";

export const Programs: CollectionConfig = {
  slug: "programs",
  // avoid clash with Prisma "program" table on shared Neon DB
  dbName: "payload_programs",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: allowPublicRead,
    create: canManageProgram,
    update: canManageProgram,
    delete: canManageProgram,
  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "organizerId",
      type: "text",
    },
    {
      name: "personInChargeId",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "DRAFT",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Registration Open", value: "REGISTRATION_OPEN" },
        { label: "Registration Closed", value: "REGISTRATION_CLOSED" },
        { label: "On Going", value: "ON_GOING" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
    {
      name: "registrationOpen",
      type: "date",
    },
    {
      name: "registrationClose",
      type: "date",
    },
    {
      name: "startDate",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
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