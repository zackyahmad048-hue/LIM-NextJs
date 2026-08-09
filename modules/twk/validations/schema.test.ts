import { describe, expect, it } from "vitest";

import {
  createWajibKhidmahMemberSchema,
  updateWajibKhidmahMemberSchema,
} from "./schema";

describe("createWajibKhidmahMemberSchema", () => {
  it("accepts a complete row with status AKTIF and '-' keterangan", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Ahmad Fauzi",
      asalDaerah: "Kediri - Jawa Timur",
      alamatLembaga: "Lirboyo",
      posWajibKhidmah: "1. Pondok Induk",
      tempatWajibKhidmah: "Asrama Sunan Ampel",
      tugasKhidmah: "Pengajar",
      status: "AKTIF",
      keterangan: "-",
      catatan: "",
      absensi: "",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to AKTIF when omitted", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Budi",
      keterangan: "-",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("AKTIF");
    }
  });

  it("rejects when status AKTIF but keterangan has real text", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Zaid",
      status: "AKTIF",
      keterangan: "Cuti sakit",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const keteranganIssue = result.error.issues.find(
        (i) => i.path[0] === "keterangan",
      );
      expect(keteranganIssue?.message).toContain("Aktif");
    }
  });

  it("rejects when status GUGUR but keterangan is empty", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Abdullah",
      status: "GUGUR",
      keterangan: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const keteranganIssue = result.error.issues.find(
        (i) => i.path[0] === "keterangan",
      );
      expect(keteranganIssue?.message).toContain("bukan Aktif");
    }
  });

  it("accepts when status GUGUR with reason", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Abdullah",
      status: "GUGUR",
      keterangan: "Melanggar tata tertib",
    });
    expect(result.success).toBe(true);
  });

  it("rejects asalDaerah that doesn't match Kota - Provinsi format", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Test",
      asalDaerah: "Jatim",
      status: "AKTIF",
      keterangan: "-",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "asalDaerah",
      );
      expect(issue?.message).toContain("Format");
    }
  });

  it("accepts empty asalDaerah (optional)", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Test",
      asalDaerah: "",
      status: "AKTIF",
      keterangan: "-",
    });
    expect(result.success).toBe(true);
  });

  it("rejects posWajibKhidmah not in master list", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "Test",
      posWajibKhidmah: "99. Invalid Pos",
      status: "AKTIF",
      keterangan: "-",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing nama", () => {
    const result = createWajibKhidmahMemberSchema.safeParse({
      nama: "",
      status: "AKTIF",
      keterangan: "-",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateWajibKhidmahMemberSchema", () => {
  it("accepts empty payload (validation moved to action layer)", () => {
    const result = updateWajibKhidmahMemberSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial update with valid field", () => {
    const result = updateWajibKhidmahMemberSchema.safeParse({
      nama: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("applies conditional refinement on partial update", () => {
    const result = updateWajibKhidmahMemberSchema.safeParse({
      status: "AKTIF",
      keterangan: "Real text",
    });
    expect(result.success).toBe(false);
  });
});
