import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageFalak } from "./access";

export const FalakQiblas: CollectionConfig = {
  slug: "falak-qiblas",
  dbName: "payload_falak_qiblas",
  admin: {
    useAsTitle: "latitude",
  },
  access: {
    read: allowPublicRead,
    create: canManageFalak,
    update: canManageFalak,
    delete: canManageFalak,
  },
  fields: [
    { name: "latitude", type: "number", required: true },
    { name: "longitude", type: "number", required: true },
    { name: "direction", type: "number", required: true },
  ],
};
