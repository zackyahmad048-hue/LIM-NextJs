import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageContent } from "./access";

export const Officers: CollectionConfig = {
  slug: "officers",
  dbName: "payload_officers",
  admin: {
    useAsTitle: "name",
    description: "Petugas/unit pengurus untuk tiap unit organisasi.",
  },
  access: {
    read: allowPublicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  fields: [
    {
      name: "unit",
      type: "relationship",
      relationTo: "units",
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "position",
      type: "text",
      required: true,
    },
    {
      name: "isLeader",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "email",
      type: "text",
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};