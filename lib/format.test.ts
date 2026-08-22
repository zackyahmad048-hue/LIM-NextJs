import { describe, expect, it } from "vitest";

import { formatDateId, formatDateInput } from "./format";

describe("formatDateId", () => {
  it("format pendek: 22 Agu 2026", () => {
    expect(formatDateId(new Date(2026, 7, 22))).toBe("22 Agu 2026");
  });

  it("format panjang: 22 Agustus 2026", () => {
    expect(formatDateId(new Date(2026, 7, 22), { long: true })).toBe(
      "22 Agustus 2026",
    );
  });

  it("menerima string tanggal", () => {
    expect(formatDateId("2026-08-22T00:00:00Z")).toBe("22 Agu 2026");
  });

  it("null/invalid memakai fallback", () => {
    expect(formatDateId(null)).toBe("");
    expect(formatDateId(null, { fallback: "—" })).toBe("—");
    expect(formatDateInput("bukan-tanggal")).toBe("");
  });
});

describe("formatDateInput", () => {
  it("mengikuti kalender WIB, bukan UTC (jam 03:00 WIB)", () => {
    // 21 Agu 2026 20:00 UTC = 22 Agu 2026 03:00 WIB
    expect(formatDateInput(new Date("2026-08-21T20:00:00Z"))).toBe(
      "2026-08-22",
    );
  });

  it("tanggal UTC tengah malam tidak bergeser (07:00 WIB)", () => {
    expect(formatDateInput(new Date("2026-08-22T00:00:00Z"))).toBe(
      "2026-08-22",
    );
  });

  it("null/invalid mengembalikan string kosong", () => {
    expect(formatDateInput(null)).toBe("");
    expect(formatDateInput(undefined)).toBe("");
  });
});
