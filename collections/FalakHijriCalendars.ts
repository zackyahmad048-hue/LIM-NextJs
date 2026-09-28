import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakHijriCalendars: CollectionConfig = {
  slug: "falak-hijri-calendars",
  dbName: "payload_falak_hijri_calendars",
  admin: {
    useAsTitle: "gregorianDate",
  },
  access: {
    read: allowPublicRead,
    create: canManageFalak,
    update: canManageFalak,
    delete: canManageFalak,
  },
  fields: [
    { name: "gregorianDate", type: "date", required: true },
    { name: "hijriYear", type: "number", required: true },
    { name: "hijriMonth", type: "number", required: true },
    { name: "hijriDay", type: "number", required: true },
    {
      name: "method",
      type: "select",
      required: true,
      options: ["HISAB", "RUKYAT", "IMKANUR_RUKYAT", "WUJUDUL_HILAL"],
    },
  ],
};
