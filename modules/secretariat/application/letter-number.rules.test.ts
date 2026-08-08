import { describe, expect, it } from "vitest";

import {
  formatLetterNumber,
  padSequence,
  parseLetterNumber,
  resolvePeriodYear,
  toRomanMonth,
  validateNumberingTemplate,
} from "./letter-number.rules";

describe("padSequence", () => {
  it("mengisi nol di depan sesuai digit", () => {
    expect(padSequence(5, 3)).toBe("005");
    expect(padSequence(42, 4)).toBe("0042");
    expect(padSequence(1000, 3)).toBe("1000");
  });
});

describe("toRomanMonth", () => {
  it("mengubah bulan ke angka Romawi", () => {
    expect(toRomanMonth(new Date(2025, 0, 10))).toBe("I");
    expect(toRomanMonth(new Date(2025, 11, 10))).toBe("XII");
  });
});

describe("validateNumberingTemplate", () => {
  it("menerima template valid", () => {
    expect(
      validateNumberingTemplate("{seq}/{level}/{category}/{bulan}/{tahun}"),
    ).toBeNull();
  });

  it("menolak template kosong", () => {
    expect(validateNumberingTemplate("   ")).not.toBeNull();
  });

  it("menolak template tanpa {seq}", () => {
    expect(validateNumberingTemplate("{level}/{category}")).not.toBeNull();
  });

  it("menolak placeholder tak dikenal", () => {
    expect(
      validateNumberingTemplate("{seq}/{bogus}"),
    ).not.toBeNull();
  });
});

describe("resolvePeriodYear", () => {
  const periods = [
    { startYear: 2020, endYear: 2023 },
    { startYear: 2024, endYear: 2029 },
  ];

  it("menentukan periode dari tahun surat", () => {
    expect(resolvePeriodYear(2025, periods)).toBe(2024);
    expect(resolvePeriodYear(2022, periods)).toBe(2020);
  });

  it("mengembalikan null bila di luar periode", () => {
    expect(resolvePeriodYear(2031, periods)).toBeNull();
    expect(resolvePeriodYear(2019, periods)).toBeNull();
  });
});

describe("formatLetterNumber", () => {
  const options = { template: "{seq}/{level}/{category}/{bulan}/{tahun}", sequenceDigits: 3 };

  it("memformat nomor lengkap", () => {
    expect(
      formatLetterNumber(
        { sequence: 7, levelCode: "PP", categoryCode: "A", romanMonth: "VIII", year: 2025 },
        options,
      ),
    ).toBe("007/PP/A/VIII/2025");
  });

  it("membiarkan placeholder tak dikenal apa adanya", () => {
    expect(
      formatLetterNumber(
        { sequence: 1, levelCode: "PP", categoryCode: "A", romanMonth: "I", year: 2025 },
        { template: "{seq}/{nope}", sequenceDigits: 2 },
      ),
    ).toBe("01/{nope}");
  });
});

describe("parseLetterNumber", () => {
  it("memecah nomor lengkap", () => {
    expect(parseLetterNumber("007/PP/A/VIII/2025")).toEqual({
      sequence: 7,
      levelCode: "PP",
      categoryCode: "A",
      romanMonth: "VIII",
      year: 2025,
    });
  });

  it("mengembalikan null untuk format tak dikenal", () => {
    expect(parseLetterNumber("bukan-nomor")).toBeNull();
  });
});
