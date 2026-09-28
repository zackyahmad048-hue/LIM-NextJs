import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageTwk } from "./access";

export const WajibKhidmahMembers: CollectionConfig = {
  slug: "wajib-khidmah-members",
  dbName: "payload_wajib_khidmah_members",
  admin: {
    useAsTitle: "nama",
  },
  access: {
    read: allowPublicRead,
    create: canManageTwk,
    update: canManageTwk,
    delete: canManageTwk,
  },
  fields: [
    { name: "nama", type: "text", required: true },
    { name: "asalDaerah", type: "text" },
    { name: "alamatLembaga", type: "text" },
    { name: "posWajibKhidmah", type: "text" },
    {
      name: "tempatWajibKhidmah",
      type: "array",
      dbName: "twk",
      fields: [{ name: "tempat", type: "text" }],
    },
    { name: "tugasKhidmah", type: "text" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "AKTIF",
      options: ["AKTIF", "GUGUR", "BEBAS_TUGAS", "QODLO"],
    },
    { name: "keterangan", type: "textarea" },
    { name: "catatan", type: "textarea" },
    { name: "absensi", type: "textarea" },
    {
      name: "lembaga",
      type: "relationship",
      relationTo: "wajib-khidmah-lembagas",
    },
  ],
};
