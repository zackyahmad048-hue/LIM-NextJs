import { describe, expect, it } from "vitest";

import { wajibKhidmahLembagaSchema } from "./schema";

function base() {
  return {
    namaLembagaPendidikan: "TPQ Al-Falah",
  };
}

describe("wajibKhidmahLembagaSchema", () => {
  it("accepts a complete valid submission", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      rtRw: "001/003",
      desaKelurahan: "Bandar Lor",
      kecamatan: "Mojoroto",
      kabupatenKota: "Kediri",
      provinsi: "Jawa Timur",
      teleponLembaga: "081234567890",
      pengasuhNama: "KH. Ahmad",
      pengasuhStatus: "ALUMNI_LIRBOYO",
      pengasuhAlumniAngkatan: "1998",
      pengasuhStatusLainnya: "",
      pengasuhTelepon: "081234567891",
      penanggungJawabNama: "Ustadz Umar",
      penanggungJawabStatus: "BUKAN_ALUMNI",
      penanggungJawabAlumniAngkatan: "",
      penanggungJawabStatusLainnya: "",
      jenislokasi: "",
      lokasiMadrasah: "DALAM_PESANTREN",
      jenisSatuanPendidikan: "TPQ",
      jenisSatuanPendidikanLainnya: "",
      kitabBermakna: ["Jawa"],
      kitabBermaknaLainnya: "",
      bahasaPengantar: ["Indonesia"],
      bahasaPengantarLainnya: "",
      jumlahPengurusPutra: 3,
      jumlahPengurusPutri: 2,
      jumlahSantriPutra: 40,
      jumlahSantriPutri: 35,
      jumlahGuruBantuDimohon: 1,
      tugasGuruBantu: "Mengajar TPQ",
      kitabDiajarkanGuruBantu: "Tashrif",
      catatanCalonGuruBantu: "Mohon dibantu.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty nama lembaga", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      namaLembagaPendidikan: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "namaLembagaPendidikan"),
      ).toBe(true);
    }
  });

  it("requires jumlahGuruBantuDimohon to be 1 or 2", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      jumlahGuruBantuDimohon: "",
    });
    expect(result.success).toBe(false);

    const result2 = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      jumlahGuruBantuDimohon: 3,
    });
    expect(result2.success).toBe(false);
  });

  it("requires status lainnya when status is LAINNYA", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      pengasuhStatus: "LAINNYA",
      pengasuhStatusLainnya: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "pengasuhStatusLainnya"),
      ).toBe(true);
    }
  });

  it("requires alumni angkatan when status is ALUMNI_LIRBOYO", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      penanggungJawabStatus: "ALUMNI_LIRBOYO",
      penanggungJawabAlumniAngkatan: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) => i.path[0] === "penanggungJawabAlumniAngkatan",
        ),
      ).toBe(true);
    }
  });

  it("does not require alumni angkatan for non-alumni status", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      pengasuhStatus: "BUKAN_ALUMNI",
      pengasuhAlumniAngkatan: "",
      jumlahGuruBantuDimohon: 1,
    });
    expect(result.success).toBe(true);
  });

  it("requires jenis satuan lainnya when LAINNYA", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      jenisSatuanPendidikan: "LAINNYA",
      jenisSatuanPendidikanLainnya: "",
      jumlahGuruBantuDimohon: 1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) => i.path[0] === "jenisSatuanPendidikanLainnya",
        ),
      ).toBe(true);
    }
  });

  it("requires kitab bermakna lainnya when 'Lainnya' selected", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...base(),
      kitabBermakna: ["Jawa", "Lainnya"],
      kitabBermaknaLainnya: "",
      jumlahGuruBantuDimohon: 1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "kitabBermaknaLainnya"),
      ).toBe(true);
    }
  });
});
