import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageProgram } from "./access";

export const ProgramDocumentations: CollectionConfig = {
  slug: "program-documentations",
  dbName: "payload_program_documentations",
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
      name: "media",
      type: "relationship",
      relationTo: "media",
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
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};