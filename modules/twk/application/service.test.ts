import { describe, expect, it } from "vitest";

import {
  LABEL_BELUM_DIISI,
  buildReportStats,
  parseCsv,
  toCsvExport,
  type MemberForReport,
} from "./service";

function member(overrides: Partial<MemberForReport> = {}): MemberForReport {
  return {
    nama: "Ahmad",
    alamat: null,
    kelas: null,
    posWajibKhidmah: null,
    tempatWajibKhidmah: null,
    ...overrides,
  };
}

describe("parseCsv", () => {
  it("returns empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("   ")).toEqual([]);
  });

  it("returns empty array for header-only CSV", () => {
    const csv = "nama,alamat,kelas\n";
    expect(parseCsv(csv)).toEqual([]);
  });

  it("parses basic rows and maps columns", () => {
    const csv = [
      "nama,alamat,kelas,posWajibKhidmah,tempatWajibKhidmah",
      "Ahmad Fauzi,Jl. A,12,Pos 1,Masjid At-Taqwa",
      "Budi,Lirboyo,11,Pos 2,Musala Nur",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ahmad Fauzi",
        alamat: "Jl. A",
        kelas: "12",
        posWajibKhidmah: "Pos 1",
        tempatWajibKhidmah: "Masjid At-Taqwa",
      },
      {
        nama: "Budi",
        alamat: "Lirboyo",
        kelas: "11",
        posWajibKhidmah: "Pos 2",
        tempatWajibKhidmah: "Musala Nur",
      },
    ]);
  });

  it("normalizes header variants and ignores unknown columns", () => {
    const csv = [
      "No, Nama, Alamat, Kelas, Pos Wajib Khidmah, Tempat Wajib Khidmah, Catatan",
      "1, Zainal, Surabaya, 9, Pos 3, Masjid Agung, bebas",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Zainal",
        alamat: "Surabaya",
        kelas: "9",
        posWajibKhidmah: "Pos 3",
        tempatWajibKhidmah: "Masjid Agung",
      },
    ]);
  });

  it("supports short aliases (pos, tempat)", () => {
    const csv = [
      "nama,pos,tempat",
      "Ali,Pos A,Tempat B",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      { nama: "Ali", posWajibKhidmah: "Pos A", tempatWajibKhidmah: "Tempat B" },
    ]);
  });

  it("skips rows with empty nama", () => {
    const csv = [
      "nama,kelas",
      "Ali,10",
      ",11",
      " ,12",
      "Budi,9",
    ].join("\n");

    expect(parseCsv(csv).map((m) => m.nama)).toEqual(["Ali", "Budi"]);
  });

  it("handles quoted fields containing commas and double quotes", () => {
    const csv = [
      'nama,alamat,kelas',
      '"Ali, M.","Jl. ""Merdeka"" No. 1",10',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      { nama: "Ali, M.", alamat: 'Jl. "Merdeka" No. 1', kelas: "10" },
    ]);
  });

  it("supports semicolon delimiter (Excel export)", () => {
    const csv = [
      "nama;alamat;kelas",
      "Ali;Jakarta;10",
      "Budi;Bandung;11",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      { nama: "Ali", alamat: "Jakarta", kelas: "10" },
      { nama: "Budi", alamat: "Bandung", kelas: "11" },
    ]);
  });

  it("trims whitespace from cells", () => {
    const csv = "nama, kelas , alamat\n  Ali  , 10 ,  Jakarta ";

    expect(parseCsv(csv)).toEqual([{ nama: "Ali", kelas: "10", alamat: "Jakarta" }]);
  });

  it("returns empty array when no nama header exists", () => {
    const csv = "foo,bar\n1,2";
    expect(parseCsv(csv)).toEqual([]);
  });
});

describe("buildReportStats", () => {
  it("returns zeroed stats for empty list", () => {
    expect(buildReportStats([])).toEqual({
      total: 0,
      perKelas: {},
      perPos: {},
      perTempat: {},
    });
  });

  it("counts members grouped by kelas, pos, and tempat", () => {
    const members = [
      member({ nama: "A", kelas: "10", posWajibKhidmah: "Pos 1", tempatWajibKhidmah: "Masjid A" }),
      member({ nama: "B", kelas: "10", posWajibKhidmah: "Pos 1", tempatWajibKhidmah: "Masjid A" }),
      member({ nama: "C", kelas: "11", posWajibKhidmah: "Pos 2", tempatWajibKhidmah: "Masjid B" }),
    ];

    expect(buildReportStats(members)).toEqual({
      total: 3,
      perKelas: { "10": 2, "11": 1 },
      perPos: { "Pos 1": 2, "Pos 2": 1 },
      perTempat: { "Masjid A": 2, "Masjid B": 1 },
    });
  });

  it("groups empty and missing values under LABEL_BELUM_DIISI", () => {
    const members = [
      member({ nama: "A" }),
      member({ nama: "B", kelas: "" }),
      member({ nama: "C", kelas: null }),
    ];

    expect(buildReportStats(members).perKelas).toEqual({
      [LABEL_BELUM_DIISI]: 3,
    });
  });
});

describe("toCsvExport", () => {
  it("emits header with no column and keeps input order", () => {
    const members = [
      member({ nama: "Budi" }),
      member({ nama: "Ali", kelas: "10" }),
    ];

    const csv = toCsvExport(members);
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      '"no","nama","alamat","kelas","posWajibKhidmah","tempatWajibKhidmah"',
    );
    expect(lines[1].startsWith('"1","Budi"')).toBe(true);
    expect(lines[2].startsWith('"2","Ali"')).toBe(true);
  });

  it("quotes cells containing commas and double quotes", () => {
    const csv = toCsvExport([member({ nama: 'Ali, "Umar"', alamat: "Jl. X" })]);

    expect(csv).toContain('"Ali, ""Umar"""');
  });
});
