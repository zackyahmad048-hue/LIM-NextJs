import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakEclipses: CollectionConfig = {
  slug: "falak-eclipses",
  dbName: "payload_falak_eclipses",
  admin: {
    useAsTitle: "eclipseDate",
  },
  access: {
    read: allowPublicRead,
    create: canManageFalak,
    update: canManageFalak,
    delete: canManageFalak,
  },
  fields: [
    {
      name: "eclipseType",
      type: "select",
      required: true,
      options: ["SOLAR", "LUNAR"],
    },
    { name: "eclipseDate", type: "date", required: true },
    { name: "visibility", type: "text" },
    { name: "details", type: "json" },
  ],
};
