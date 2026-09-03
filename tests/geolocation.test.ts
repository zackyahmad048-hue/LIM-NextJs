import { describe, expect, it } from "vitest";

import { getTimezoneFromLongitude } from "@/hooks/use-geolocation";

describe("getTimezoneFromLongitude()", () => {
  it("classifies WIB (UTC+7) for western/central Indonesia below 115°E", () => {
    // Jakarta, Bandung, and all of Java (including East Java) are WIB.
    for (const lon of [106.85, 110.36, 113.7, 114.37, 114.99]) {
      expect(getTimezoneFromLongitude(lon)).toEqual({
        timezone: 7,
        timezoneName: "WIB",
      });
    }
  });

  it("classifies WITA (UTC+8) from 115°E to below 127.5°E", () => {
    for (const lon of [115.0, 115.2, 118.0, 124.0, 127.49]) {
      expect(getTimezoneFromLongitude(lon)).toEqual({
        timezone: 8,
        timezoneName: "WITA",
      });
    }
  });

  it("classifies WIT (UTC+9) from 127.5°E", () => {
    for (const lon of [127.5, 131.1, 140.7, 134.0]) {
      expect(getTimezoneFromLongitude(lon)).toEqual({
        timezone: 9,
        timezoneName: "WIT",
      });
    }
  });

  it("keeps East Java (e.g. Banyuwangi) in WIB, not WITA", () => {
    // Regression: a longitude boundary at 113.5°E wrongly put East Java in WITA.
    expect(getTimezoneFromLongitude(114.3664).timezone).toBe(7);
  });

  it("keeps Bali (e.g. Denpasar) in WITA despite similar longitude to East Java", () => {
    // Regression guard: the boundary must not force Bali/Lombok into WIB.
    expect(getTimezoneFromLongitude(115.2165).timezone).toBe(8);
  });
});
