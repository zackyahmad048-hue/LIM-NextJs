import { describe, expect, it } from "vitest";

import {
  createOutgoingMailSchema,
  parseLocalDateInput,
  parseQrPagePosition,
  parseQrPosition,
} from "./schema";

describe("createOutgoingMailSchema date validation", () => {
  function base(date: string) {
    return {
      levelCode: "PP",
      categoryCode: "UNDANGAN",
      mailDate: date,
      recipient: "Test",
      subject: "Undangan Rapat",
    };
  }

  it("menerima tanggal hari ini (tidak terpengaruh timezone UTC+7)", () => {
    const today = new Date();
    const value = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    expect(createOutgoingMailSchema.safeParse(base(value)).success).toBe(true);
  });

  it("menolak tanggal masa depan", () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const value = `${future.getFullYear()}-${String(
      future.getMonth() + 1,
    ).padStart(2, "0")}-${String(future.getDate()).padStart(2, "0")}`;
    expect(createOutgoingMailSchema.safeParse(base(value)).success).toBe(false);
  });
});

describe("parseLocalDateInput", () => {
  it("memparse YYYY-MM-DD sebagai tanggal lokal", () => {
    const parsed = parseLocalDateInput("2026-08-11");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(7);
    expect(parsed.getDate()).toBe(11);
    // Harus tengah malam lokal, bukan UTC (mencegah bug timezone).
    expect(parsed.getHours()).toBe(0);
  });
});

describe("QR position parsing", () => {
  it("memparse posisi ketua/sekretaris (dengan halaman)", () => {
    expect(parseQrPagePosition('{"page":1,"x":31,"y":60}')).toEqual({
      page: 1,
      x: 31,
      y: 60,
    });
  });

  it("memparse posisi verifikasi (tanpa halaman)", () => {
    expect(parseQrPosition('{"x":175,"y":12}')).toEqual({ x: 175, y: 12 });
  });

  it("mengembalikan null untuk nilai kosong", () => {
    expect(parseQrPagePosition("")).toBeNull();
    expect(parseQrPosition("")).toBeNull();
  });
});
