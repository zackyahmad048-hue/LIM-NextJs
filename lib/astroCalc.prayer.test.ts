import { describe, expect, it } from "vitest";

import { getNextPrayer, type PrayerTimesNumeric } from "./astroCalc";

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
