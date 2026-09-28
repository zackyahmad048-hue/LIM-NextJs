import type { CollectionConfig } from "payload";

import { canManageSecretariat, canReadContent } from "./access";

export const AgendaBooks: CollectionConfig = {
  slug: "agenda-books",
  dbName: "payload_agenda_books",
  admin: {
    useAsTitle: "title",
    description: "Buku agenda kegiatan sekretariat.",
  },
  access: {
    read: canReadContent,
    create: canManageSecretariat,
    update: canManageSecretariat,
    delete: canManageSecretariat,
  },
  fields: [
    {
      name: "date",
      type: "date",
      required: true,
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
      name: "location",
      type: "text",
    },
    {
      name: "participants",
      type: "textarea",
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