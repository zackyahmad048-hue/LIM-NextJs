import type { CollectionConfig } from "payload";

import { allowPublicRead, canManageTwk } from "./access";

export const WajibKhidmahLembagas: CollectionConfig = {
  slug: "wajib-khidmah-lembagas",
  dbName: "payload_wajib_khidmah_lembagas",
  admin: {
    useAsTitle: "namaLembagaPendidikan",
  },
  access: {
    read: allowPublicRead,
    create: canManageTwk,
    update: canManageTwk,
    delete: canManageTwk,
  },
  fields: [
    { name: "namaLembagaPendidikan", type: "text", required: true },
    { name: "rtRw", type: "text" },
    { name: "desaKelurahan", type: "text" },
    { name: "kecamatan", type: "text" },
    { name: "kabupatenKota", type: "text" },
    { name: "provinsi", type: "text" },
    { name: "teleponLembaga", type: "text" },
    { name: "mediaSosialLembaga", type: "text" },

    { name: "pengasuhNama", type: "text" },
    {
      name: "pengasuhStatus",
      type: "select",
      options: ["ALUMNI_LIRBOYO", "BUKAN_ALUMNI", "WALI_SANTRI", "LAINNYA"],
    },
    { name: "pengasuhStatusLainnya", type: "text" },
    { name: "pengasuhAlumniAngkatan", type: "text" },
    { name: "pengasuhTelepon", type: "text" },
    { name: "pengasuhFotoFileId", type: "text" },

    { name: "penanggungJawabNama", type: "text" },
    {
      name: "penanggungJawabStatus",
      type: "select",
      options: ["ALUMNI_LIRBOYO", "BUKAN_ALUMNI", "WALI_SANTRI", "LAINNYA"],
    },
    { name: "penanggungJawabStatusLainnya", type: "text" },
    { name: "penanggungJawabAlumniAngkatan", type: "text" },
    { name: "penanggungJawabTelepon", type: "text" },
    { name: "penanggungJawabFotoFileId", type: "text" },

    {
      name: "lokasiMadrasah",
      type: "select",
      options: ["DALAM_PESANTREN", "LUAR_PESANTREN"],
    },
    {
      name: "jenisSatuanPendidikan",
      type: "select",
      hasMany: true,
      dbName: "jsp",
      enumName: "enum_jsp",
      options: [
        "TPQ",
        "MADRASAH_DINIYAH",
        "MI",
        "MTS",
        "MA",
        "SD_PESANTREN",
        "SMP_PESANTREN",
        "SMA_PESANTREN",
        "KMI",
        "PDF",
        "LAINNYA",
      ],
    },
    { name: "jenisSatuanPendidikanLainnya", type: "text" },
    {
      name: "kitabBermakna",
      type: "array",
      fields: [{ name: "kitab", type: "text" }],
    },
    { name: "kitabBermaknaLainnya", type: "text" },
    {
      name: "bahasaPengantar",
      type: "array",
      fields: [{ name: "bahasa", type: "text" }],
    },
    { name: "bahasaPengantarLainnya", type: "text" },
    { name: "jumlahPengurusPutra", type: "number" },
    { name: "jumlahPengurusPutri", type: "number" },
    { name: "jumlahSantriPutra", type: "number" },
    { name: "jumlahSantriPutri", type: "number" },

    {
      name: "jumlahGuruBantuDimohon",
      type: "number",
      required: true,
      min: 1,
      max: 2,
    },
    { name: "tugasGuruBantu", type: "textarea" },
    { name: "kitabDiajarkanGuruBantu", type: "text" },
    { name: "catatanCalonGuruBantu", type: "textarea" },
    { name: "dokumenPermohonanFileId", type: "text" },
  ],
};
