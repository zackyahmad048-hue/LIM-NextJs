import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakHisabs: CollectionConfig = {
  slug: "falak-hisabs",
  dbName: "payload_falak_hisabs",
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
    { name: "calculationDate", type: "date", required: true },
    { name: "locationName", type: "text", required: true },
    { name: "latitude", type: "number", required: true },
    { name: "longitude", type: "number", required: true },
    { name: "parameters", type: "json", required: true },
    { name: "result", type: "json", required: true },
    { name: "calculatedById", type: "text" },
    {
      name: "deletedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
