import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakPrayerTimes: CollectionConfig = {
  slug: "falak-prayer-times",
  dbName: "payload_falak_prayer_times",
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
    { name: "locationName", type: "text", required: true },
    { name: "latitude", type: "number", required: true },
    { name: "longitude", type: "number", required: true },
    { name: "timezone", type: "text", required: true },
    {
      name: "calculationMethod",
      type: "select",
      required: true,
      options: [
        "KEMENAG",
        "MUHAMMADIYAH",
        "UMMAH_AL_QURA",
        "EGYPTIAN",
        "ISNA",
        "MWL",
      ],
    },
    { name: "prayerDate", type: "date", required: true },
    { name: "fajr", type: "date", required: true },
    { name: "sunrise", type: "date", required: true },
    { name: "dhuhr", type: "date", required: true },
    { name: "asr", type: "date", required: true },
    { name: "maghrib", type: "date", required: true },
    { name: "isha", type: "date", required: true },
  ],
};
