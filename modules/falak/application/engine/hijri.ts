import { toHijri } from "hijri-converter";
import type { HijriDate } from "../../domain/types";

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

const HIJRI_MONTH_NAMES_ID = [
  "Muharram",
  "Safar",
  "Rabi'ul Awal",
  "Rabi'ul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawwal",
  "Dzulqo'dah",
  "Dzulhijjah",
];

export function gregorianToHijri(date: Date): HijriDate {
  const result = toHijri(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return { year: result.hy, month: result.hm, day: result.hd };
}

export function hijriMonthName(
  month: number,
  locale: "en" | "id" = "id",
): string {
  const names = locale === "id" ? HIJRI_MONTH_NAMES_ID : HIJRI_MONTH_NAMES;
  return names[month - 1] ?? "";
}

export function hijriDateToString(
  hijri: HijriDate,
  locale: "en" | "id" = "id",
): string {
  const monthName = hijriMonthName(hijri.month, locale);
  return `${hijri.day} ${monthName} ${hijri.year} H`;
}

export function getDaysInHijriMonth(year: number, month: number): number {
  const hijriMonths: Record<number, number> = {
    1: 30,
    2: 29,
    3: 30,
    4: 29,
    5: 30,
    6: 29,
    7: 30,
    8: 29,
    9: 30,
    10: 29,
    11: 30,
    12: 29,
  };

  const isLeapYear =
    year % 30 === 2 ||
    year % 30 === 5 ||
    year % 30 === 7 ||
    year % 30 === 10 ||
    year % 30 === 13 ||
    year % 30 === 16 ||
    year % 30 === 18 ||
    year % 30 === 21 ||
    year % 30 === 24 ||
    year % 30 === 26 ||
    year % 30 === 29;

  if (month === 12 && isLeapYear) return 30;
  return hijriMonths[month] ?? 29;
}
