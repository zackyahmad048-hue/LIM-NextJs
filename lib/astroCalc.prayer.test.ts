import { describe, expect, it } from "vitest";

import {
  convertToIstiwaClock,
  dateToDecimalHoursInZone,
  getNextPrayer,
  type LocationInfo,
  type PrayerTimesNumeric,
} from "./astroCalc";

const KEDIRI_TIMES: PrayerTimesNumeric = {
  fajr: 4.2,
  sunrise: 5.5,
  dhuhr: 11.6,
  asr: 15.0,
  maghrib: 17.7,
  isha: 18.9,
};

describe("getNextPrayer()", () => {
  it("returns Subuh after Isya (rolls over midnight)", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 22.0);
    expect(next.key).toBe("fajr");
    expect(next.diffHours).toBeCloseTo(6.2);
  });

  it("returns Dzuhur after Subuh, skipping sunrise", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 5.0);
    expect(next.key).toBe("dhuhr");
    expect(next.diffHours).toBeCloseTo(6.6);
  });

  it("returns Subuh before Subuh", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 3.0);
    expect(next.key).toBe("fajr");
    expect(next.diffHours).toBeCloseTo(1.2);
  });

  it("returns Ashar in the middle of the day", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 13.0);
    expect(next.key).toBe("asr");
    expect(next.diffHours).toBeCloseTo(2.0);
  });

  it("returns Isya between Maghrib and Isya", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 18.0);
    expect(next.key).toBe("isha");
    expect(next.diffHours).toBeCloseTo(0.9);
  });

  it("treats a prayer at the exact current time as passed", () => {
    const next = getNextPrayer(KEDIRI_TIMES, 4.2);
    expect(next.key).toBe("dhuhr");
  });

  it("works in Istiwa' clock values", () => {
    const istiwaTimes: PrayerTimesNumeric = {
      fajr: 4.8,
      sunrise: 6.0,
      dhuhr: 12.2,
      asr: 15.5,
      maghrib: 18.1,
      isha: 19.2,
    };
    const next = getNextPrayer(istiwaTimes, 22.0);
    expect(next.key).toBe("fajr");
    expect(next.diffHours).toBeCloseTo(6.8);
  });
});

describe("dateToDecimalHoursInZone()", () => {
  it("maps a UTC instant into a desired UTC-offset timezone", () => {
    // UTC 07:30:00 → WIB (+7) = 14:30:00
    const utc = new Date("2026-09-01T07:30:00.000Z");
    const wib = dateToDecimalHoursInZone(utc, 7);
    expect(wib).toBeCloseTo(14.5);

    // UTC 22:00:00 → WIT (+9) = 07:00:00 (next day, wrapped to 0-24)
    const witUtc = new Date("2026-09-01T22:00:00.000Z");
    const wit = dateToDecimalHoursInZone(witUtc, 9);
    expect(wit).toBeCloseTo(7.0);
  });

  it("matches the location timezone even when the device clock differs", () => {
    // Represents the same instant; the helper must ignore the device's local
    // zone and produce the location's wall-clock hour.
    const instant = new Date("2026-09-01T03:00:00.000Z");
    // WITA (+8) wall clock = 11:00
    expect(dateToDecimalHoursInZone(instant, 8)).toBeCloseTo(11.0);
    // WIB (+7) wall clock = 10:00
    expect(dateToDecimalHoursInZone(instant, 7)).toBeCloseTo(10.0);
  });
});

describe("convertToIstiwaClock()", () => {
  const kediri: LocationInfo = {
    latitude: -7.82,
    longitude: 112.01,
    timezone: 7,
    timezoneName: "WIB",
  };

  it("produces an istiwa time consistently from a given instant", () => {
    const result = convertToIstiwaClock(
      new Date("2026-09-01T02:00:00.000Z"),
      kediri,
    );
    expect(result.istiwaTimeStr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("reflects a different longitude (same instant, shifted solar time)", () => {
    const instant = new Date("2026-09-01T03:00:00.000Z");
    const wib = convertToIstiwaClock(instant, kediri);
    const west: LocationInfo = { ...kediri, longitude: 106.85 };
    const jakarta = convertToIstiwaClock(instant, west);
    // Istiwa is a solar (longitude-dependent) clock, so locations at different
    // longitudes differ even though it is the same instant.
    expect(jakarta.istiwaTimeStr).not.toBe(wib.istiwaTimeStr);
  });
});
