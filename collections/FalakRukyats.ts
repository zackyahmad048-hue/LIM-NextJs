import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakRukyats: CollectionConfig = {
  slug: "falak-rukyats",
  dbName: "payload_falak_rukyats",
  admin: {
    useAsTitle: "locationName",
  },
  access: {
    read: allowPublicRead,
    create: canManageFalak,
    update: canManageFalak,
    delete: canManageFalak,
  },
  fields: [
    { name: "observationDate", type: "date", required: true },
    { name: "locationName", type: "text", required: true },
    { name: "latitude", type: "number", required: true },
    { name: "longitude", type: "number", required: true },
    { name: "observerId", type: "text", required: true },
    { name: "weather", type: "text", required: true },
    {
      name: "result",
      type: "select",
      required: true,
      options: ["VISIBLE", "NOT_VISIBLE", "CLOUDY", "UNKNOWN"],
    },
    { name: "notes", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "DRAFT",
      options: ["DRAFT", "VERIFIED", "CONFIRMED", "ARCHIVED"],
    },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
