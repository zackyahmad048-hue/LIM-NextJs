import { describe, expect, it } from "vitest";

import { wajibKhidmahLembagaSchema } from "./schema";

function base() {
  return {
    namaLembagaPendidikan: "TPQ Al-Falah",
  };
}

function valid() {
  return {
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
    pengasuhFotoFileId: "file-pengasuh",
    penanggungJawabNama: "Ustadz Umar",
    penanggungJawabStatus: "BUKAN_ALUMNI",
    penanggungJawabAlumniAngkatan: "",
    penanggungJawabStatusLainnya: "",
    penanggungJawabTelepon: "081234567892",
    penanggungJawabFotoFileId: "file-pj",
    lokasiMadrasah: "DALAM_PESANTREN",
    jenisSatuanPendidikan: ["TPQ", "MADRASAH_DINIYAH"],
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
    dokumenPermohonanFileId: "file-dokumen",
  };
}

describe("wajibKhidmahLembagaSchema", () => {
  it("accepts a complete valid submission", () => {
    const result = wajibKhidmahLembagaSchema.safeParse(valid());
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

  it("rejects missing required identitas lembaga fields", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      rtRw: "",
      desaKelurahan: "",
      kecamatan: "",
      kabupatenKota: "",
      provinsi: "",
      teleponLembaga: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const field of [
        "rtRw",
        "desaKelurahan",
        "kecamatan",
        "kabupatenKota",
        "provinsi",
        "teleponLembaga",
      ]) {
        expect(
          result.error.issues.some((i) => i.path[0] === field),
        ).toBe(true);
      }
    }
  });

  it("rejects missing required pemohon fields", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      pengasuhNama: "",
      pengasuhStatus: "",
      pengasuhTelepon: "",
      pengasuhFotoFileId: "",
      penanggungJawabNama: "",
      penanggungJawabStatus: "",
      penanggungJawabTelepon: "",
      penanggungJawabFotoFileId: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const field of [
        "pengasuhNama",
        "pengasuhStatus",
        "pengasuhTelepon",
        "pengasuhFotoFileId",
        "penanggungJawabNama",
        "penanggungJawabStatus",
        "penanggungJawabTelepon",
        "penanggungJawabFotoFileId",
      ]) {
        expect(
          result.error.issues.some((i) => i.path[0] === field),
        ).toBe(true);
      }
    }
  });

  it("rejects missing required kondisi lembaga fields", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      lokasiMadrasah: "",
      jenisSatuanPendidikan: [],
      kitabBermakna: [],
      bahasaPengantar: [],
      jumlahPengurusPutra: "",
      jumlahPengurusPutri: "",
      jumlahSantriPutra: "",
      jumlahSantriPutri: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const field of [
        "lokasiMadrasah",
        "jenisSatuanPendidikan",
        "kitabBermakna",
        "bahasaPengantar",
        "jumlahPengurusPutra",
        "jumlahPengurusPutri",
        "jumlahSantriPutra",
        "jumlahSantriPutri",
      ]) {
        expect(
          result.error.issues.some((i) => i.path[0] === field),
        ).toBe(true);
      }
    }
  });

  it("rejects missing required permohonan & upload fields", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      tugasGuruBantu: "",
      kitabDiajarkanGuruBantu: "",
      catatanCalonGuruBantu: "",
      dokumenPermohonanFileId: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      for (const field of [
        "tugasGuruBantu",
        "kitabDiajarkanGuruBantu",
        "catatanCalonGuruBantu",
        "dokumenPermohonanFileId",
      ]) {
        expect(
          result.error.issues.some((i) => i.path[0] === field),
        ).toBe(true);
      }
    }
  });

  it("requires jumlahGuruBantuDimohon to be 1 or 2", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      jumlahGuruBantuDimohon: "",
    });
    expect(result.success).toBe(false);

    const result2 = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      jumlahGuruBantuDimohon: 3,
    });
    expect(result2.success).toBe(false);
  });

  it("requires status lainnya when status is LAINNYA", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
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
      ...valid(),
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
      ...valid(),
      pengasuhStatus: "BUKAN_ALUMNI",
      pengasuhAlumniAngkatan: "",
    });
    expect(result.success).toBe(true);
  });

  it("requires jenis satuan lainnya when LAINNYA", () => {
    const result = wajibKhidmahLembagaSchema.safeParse({
      ...valid(),
      jenisSatuanPendidikan: ["LAINNYA"],
      jenisSatuanPendidikanLainnya: "",
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
      ...valid(),
      kitabBermakna: ["Jawa", "Lainnya"],
      kitabBermaknaLainnya: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "kitabBermaknaLainnya"),
      ).toBe(true);
    }
  });
});
