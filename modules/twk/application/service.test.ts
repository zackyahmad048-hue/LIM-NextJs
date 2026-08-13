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
    asalDaerah: null,
    alamatLembaga: null,
    posWajibKhidmah: null,
    tempatWajibKhidmah: [],
    ...overrides,
  };
}

describe("parseCsv", () => {
  it("returns empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("   ")).toEqual([]);
  });

  it("returns empty array for header-only CSV", () => {
    const csv = "nama,asalDaerah,alamatLembaga\n";
    expect(parseCsv(csv)).toEqual([]);
  });

  it("parses basic rows and maps columns", () => {
    const csv = [
      "nama,asalDaerah,alamatLembaga,posWajibKhidmah,tempatWajibKhidmah",
      "Ahmad Fauzi,Kediri - Jawa Timur,Lirboyo,1. Pondok Induk,Asrama Sunan Ampel",
      "Budi,Demak - Jawa Tengah,Demak Kota,3. Pondok Cabang Zonasi,PP. Demak",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ahmad Fauzi",
        asalDaerah: "Kediri - Jawa Timur",
        alamatLembaga: "Lirboyo",
        posWajibKhidmah: "1. Pondok Induk",
        tempatWajibKhidmah: ["Asrama Sunan Ampel"],
        status: "AKTIF",
      },
      {
        nama: "Budi",
        asalDaerah: "Demak - Jawa Tengah",
        alamatLembaga: "Demak Kota",
        posWajibKhidmah: "3. Pondok Cabang Zonasi",
        tempatWajibKhidmah: ["PP. Demak"],
        status: "AKTIF",
      },
    ]);
  });

  it("normalizes header variants and ignores unknown columns", () => {
    const csv = [
      "No, Nama, Asal Daerah, Alamat Lembaga, Pos Wajib Khidmah, Tempat Wajib Khidmah, Catatan",
      "1, Zainal, Surabaya - Jatim, Masjid Agung, 3. Pondok Cabang Zonasi, Masjid Agung, bebas",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Zainal",
        asalDaerah: "Surabaya - Jatim",
        alamatLembaga: "Masjid Agung",
        posWajibKhidmah: "3. Pondok Cabang Zonasi",
        tempatWajibKhidmah: ["Masjid Agung"],
        catatan: "bebas",
        status: "AKTIF",
      },
    ]);
  });

  it("supports short aliases (pos, tempat, asal)", () => {
    const csv = [
      "nama,pos,tempat,asal",
      "Ali,1. Pondok Induk,Tempat B,Kediri - Jatim",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ali",
        posWajibKhidmah: "1. Pondok Induk",
        tempatWajibKhidmah: ["Tempat B"],
        asalDaerah: "Kediri - Jatim",
        status: "AKTIF",
      },
    ]);
  });

  it("skips rows with empty nama", () => {
    const csv = [
      "nama,posWajibKhidmah",
      "Ali,1. Pondok Induk",
      ",3. Pondok Cabang Zonasi",
      " ,4. Pondok Cabang non Zonasi",
      "Budi,2. Pondok Unit",
    ].join("\n");

    expect(parseCsv(csv).map((m) => m.nama)).toEqual(["Ali", "Budi"]);
  });

  it("handles quoted fields containing commas and double quotes", () => {
    const csv = [
      'nama,alamatLembaga,tempatWajibKhidmah',
      '"Ali, M.","Jl. ""Merdeka"" No. 1",PP. X',
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ali, M.",
        alamatLembaga: 'Jl. "Merdeka" No. 1',
        tempatWajibKhidmah: ["PP. X"],
        status: "AKTIF",
      },
    ]);
  });

  it("supports semicolon delimiter (Excel export)", () => {
    const csv = [
      "nama;asalDaerah;tempatWajibKhidmah",
      "Ali;Jakarta - DKI Jakarta;PP. A",
      "Budi;Bandung - Jawa Barat;PP. B",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ali",
        asalDaerah: "Jakarta - DKI Jakarta",
        tempatWajibKhidmah: ["PP. A"],
        status: "AKTIF",
      },
      {
        nama: "Budi",
        asalDaerah: "Bandung - Jawa Barat",
        tempatWajibKhidmah: ["PP. B"],
        status: "AKTIF",
      },
    ]);
  });

  it("trims whitespace from cells", () => {
    const csv = "nama, asalDaerah , tempatWajibKhidmah\n  Ali  , Kediri - Jatim ,  PP. A ";

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ali",
        asalDaerah: "Kediri - Jatim",
        tempatWajibKhidmah: ["PP. A"],
        status: "AKTIF",
      },
    ]);
  });

  it("splits multiple tempatWajibKhidmah values by ';' into an array", () => {
    const csv = [
      "nama,tempatWajibKhidmah",
      "Ali,Seksi; Mudarris; Wali Asuh",
    ].join("\n");

    expect(parseCsv(csv)).toEqual([
      {
        nama: "Ali",
        tempatWajibKhidmah: ["Seksi", "Mudarris", "Wali Asuh"],
        status: "AKTIF",
      },
    ]);
  });

  it("normalizes status from various casings", () => {
    const csv = [
      "nama,status",
      "Ali,aktif",
      "Budi,GUGUR",
      "Cici,bebas tugas",
      "Dodi,Qodlo",
    ].join("\n");

    const result = parseCsv(csv);
    expect(result.map((m) => m.status)).toEqual([
      "AKTIF",
      "GUGUR",
      "BEBAS_TUGAS",
      "QODLO",
    ]);
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
      perStatus: {},
      perPos: {},
      perTempat: {},
      perTugas: {},
    });
  });

  it("counts members grouped by status, pos, tempat, tugas", () => {
    const members = [
      member({
        nama: "A",
        posWajibKhidmah: "1. Pondok Induk",
        tempatWajibKhidmah: ["Masjid A"],
        tugasKhidmah: "Pengajar",
        status: "AKTIF",
      }),
      member({
        nama: "B",
        posWajibKhidmah: "1. Pondok Induk",
        tempatWajibKhidmah: ["Masjid A"],
        tugasKhidmah: "Pengajar",
        status: "AKTIF",
      }),
      member({
        nama: "C",
        posWajibKhidmah: "2. Pondok Unit",
        tempatWajibKhidmah: ["Masjid B"],
        tugasKhidmah: "Keamanan",
        status: "GUGUR",
      }),
    ];

    expect(buildReportStats(members)).toEqual({
      total: 3,
      perStatus: { AKTIF: 2, GUGUR: 1 },
      perPos: { "1. Pondok Induk": 2, "2. Pondok Unit": 1 },
      perTempat: { "Masjid A": 2, "Masjid B": 1 },
      perTugas: { Pengajar: 2, Keamanan: 1 },
    });
  });

  it("counts each tempatWajibKhidmah value across members", () => {
    const members = [
      member({
        nama: "A",
        tempatWajibKhidmah: ["Masjid A", "Seksi"],
      }),
      member({
        nama: "B",
        tempatWajibKhidmah: ["Masjid A"],
      }),
      member({
        nama: "C",
        tempatWajibKhidmah: [],
      }),
    ];

    expect(buildReportStats(members).perTempat).toEqual({
      "Masjid A": 2,
      Seksi: 1,
      [LABEL_BELUM_DIISI]: 1,
    });
  });

  it("groups empty and missing values under LABEL_BELUM_DIISI", () => {
    const members = [
      member({ nama: "A" }),
      member({ nama: "B", posWajibKhidmah: "" }),
      member({ nama: "C", posWajibKhidmah: null }),
    ];

    expect(buildReportStats(members).perPos).toEqual({
      [LABEL_BELUM_DIISI]: 3,
    });
  });
});

describe("toCsvExport", () => {
  it("emits header with no column and keeps input order", () => {
    const members = [
      member({ nama: "Budi" }),
      member({ nama: "Ali", posWajibKhidmah: "1. Pondok Induk" }),
    ];

    const csv = toCsvExport(members);
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      '"no","nama","asalDaerah","alamatLembaga","posWajibKhidmah","tempatWajibKhidmah","tugasKhidmah","status","keterangan","catatan","absensi"',
    );
    expect(lines[1].startsWith('"1","Budi"')).toBe(true);
    expect(lines[2].startsWith('"2","Ali"')).toBe(true);
  });

  it("quotes cells containing commas and double quotes", () => {
    const csv = toCsvExport([
      member({ nama: 'Ali, "Umar"', alamatLembaga: "Jl. X" }),
    ]);

    expect(csv).toContain('"Ali, ""Umar"""');
  });
});
