/**
 * Custom Astronomical Calculation Library for Prayer Times & Jam Istiwa
 * Pure TypeScript implementation following Kemenag RI & Astronomical Standards
 */

export interface PrayerTimes {
  fajr: string; // Subuh
  sunrise: string; // Terbit
  dhuhr: string; // Dzuhur
  asr: string; // Ashar
  maghrib: string; // Maghrib
  isha: string; // Isya
}

export interface PrayerTimesNumeric {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  timezone: number; // UTC offset e.g., +7 for WIB, +8 for WITA, +9 for WIT
  timezoneName?: string; // 'WIB' | 'WITA' | 'WIT' | string
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function degToRad(d: number): number {
  return d * RAD;
}

function radToDeg(r: number): number {
  return r * DEG;
}

function fixAngle(a: number): number {
  a = a - 360 * Math.floor(a / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(h: number): number {
  h = h - 24 * Math.floor(h / 24);
  return h < 0 ? h + 24 : h;
}

/**
 * Calculates Julian Day number for a given date at 00:00 UTC
 */
export function getJulianDay(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5
  );
}

/**
 * Calculate Solar Coordinates: Declination (dec) and Equation of Time (eqt in hours)
 */
export function getSunCoordinates(jd: number): { dec: number; eqt: number } {
  const D = jd - 2451545.0; // Days since J2000.0
  const g = fixAngle(357.529 + 0.98560028 * D); // Mean anomaly
  const q = fixAngle(280.459 + 0.98564736 * D); // Mean longitude

  // Ecliptic longitude
  const L = fixAngle(
    q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)),
  );

  // Obliquity of ecliptic
  const e = 23.439 - 0.00000036 * D;

  // Solar Declination
  const dec = radToDeg(
    Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))),
  );

  // Right Ascension
  let RA =
    radToDeg(
      Math.atan2(
        Math.cos(degToRad(e)) * Math.sin(degToRad(L)),
        Math.cos(degToRad(L)),
      ),
    ) / 15;
  RA = fixHour(RA);

  // Equation of Time in hours
  let eqt = q / 15 - RA;
  if (eqt > 12) eqt -= 24;
  if (eqt < -12) eqt += 24;

  return { dec, eqt };
}

/**
 * Hour angle for a given altitude angle (h)
 */
function hourAngle(h: number, lat: number, dec: number): number {
  const top =
    Math.sin(degToRad(h)) - Math.sin(degToRad(lat)) * Math.sin(degToRad(dec));
  const bottom = Math.cos(degToRad(lat)) * Math.cos(degToRad(dec));
  const cosH = top / bottom;

  if (cosH > 1) return 0;
  if (cosH < -1) return 12;

  return radToDeg(Math.acos(cosH)) / 15;
}

/**
 * Hour angle for Asr prayer (Shadow factor n = 1 for Syafii/Hambali/Maliki)
 */
function asrHourAngle(shadowFactor: number, lat: number, dec: number): number {
  const phiMinusDelta = Math.abs(lat - dec);
  const cotH = shadowFactor + Math.tan(degToRad(phiMinusDelta));
  const h = radToDeg(Math.atan(1 / cotH));
  return hourAngle(h, lat, dec);
}

/**
 * Format decimal hours into HH:MM:SS string
 */
export function formatTime(
  decimalHours: number,
  includeSeconds = false,
): string {
  const h = fixHour(decimalHours);
  const hours = Math.floor(h);
  const minutesDec = (h - hours) * 60;
  const minutes = Math.floor(minutesDec);
  const seconds = Math.floor((minutesDec - minutes) * 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (includeSeconds) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(hours)}:${pad(minutes)}`;
}

/**
 * Calculate Local Solar Transit Time (Dhuhr unbuffered) in Standard Local Hours
 */
export function getSolarTransitStandard(
  longitude: number,
  timezone: number,
  eqt: number,
): number {
  return 12 + timezone - longitude / 15 - eqt;
}

/**
 * Main Prayer Calculation Engine (Waktu Standar vs Waktu Istiwa)
 * Default Ihtiyath = 3 Menit (sesuai standar Kemenag RI & Fiqih)
 */
export function calculatePrayerTimes(
  date: Date,
  location: LocationInfo,
  isIstiwaMode = false,
  ihtiyathMinutes = 3,
): {
  timesFormatted: PrayerTimes;
  timesNumeric: PrayerTimesNumeric;
  transitStandard: number;
  deltaMinutes: number;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDay(year, month, day);
  const { dec, eqt } = getSunCoordinates(jd);

  const lat = location.latitude;
  const lon = location.longitude;
  const tz = location.timezone;

  const transitStd = getSolarTransitStandard(lon, tz, eqt);
  const deltaMinutes = (12 - transitStd) * 60;
  const ihtiyath = ihtiyathMinutes / 60;

  const hFajr = hourAngle(-20, lat, dec);
  const hSunrise = hourAngle(-0.8333, lat, dec);
  const hAsr = asrHourAngle(1, lat, dec);
  const hSunset = hourAngle(-0.8333, lat, dec);
  const hIsha = hourAngle(-18, lat, dec);

  let fajrNum: number;
  let sunriseNum: number;
  let dhuhrNum: number;
  let asrNum: number;
  let maghribNum: number;
  let ishaNum: number;

  if (!isIstiwaMode) {
    dhuhrNum = transitStd + ihtiyath;
    fajrNum = transitStd - hFajr + ihtiyath;
    sunriseNum = transitStd - hSunrise - ihtiyath;
    asrNum = transitStd + hAsr + ihtiyath;
    maghribNum = transitStd + hSunset + ihtiyath;
    ishaNum = transitStd + hIsha + ihtiyath;
  } else {
    dhuhrNum = 12 + ihtiyath;
    fajrNum = 12 - hFajr + ihtiyath;
    sunriseNum = 12 - hSunrise - ihtiyath;
    asrNum = 12 + hAsr + ihtiyath;
    maghribNum = 12 + hSunset + ihtiyath;
    ishaNum = 12 + hIsha + ihtiyath;
  }

  const timesNumeric: PrayerTimesNumeric = {
    fajr: fixHour(fajrNum),
    sunrise: fixHour(sunriseNum),
    dhuhr: fixHour(dhuhrNum),
    asr: fixHour(asrNum),
    maghrib: fixHour(maghribNum),
    isha: fixHour(ishaNum),
  };

  const timesFormatted: PrayerTimes = {
    fajr: formatTime(timesNumeric.fajr),
    sunrise: formatTime(timesNumeric.sunrise),
    dhuhr: formatTime(timesNumeric.dhuhr),
    asr: formatTime(timesNumeric.asr),
    maghrib: formatTime(timesNumeric.maghrib),
    isha: formatTime(timesNumeric.isha),
  };

  return {
    timesFormatted,
    timesNumeric,
    transitStandard: transitStd,
    deltaMinutes,
  };
}

/**
 * Convert Current Standard Date/Time into Live Istiwa Time string (HH:MM:SS)
 */
export function convertToIstiwaClock(
  currentDate: Date,
  location: LocationInfo,
): { istiwaTimeStr: string; deltaStr: string } {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const jd = getJulianDay(year, month, day);
  const { eqt } = getSunCoordinates(jd);

  const transitStd = getSolarTransitStandard(
    location.longitude,
    location.timezone,
    eqt,
  );
  const localStdHours =
    currentDate.getHours() +
    currentDate.getMinutes() / 60 +
    currentDate.getSeconds() / 3600;

  const istiwaHours = fixHour(localStdHours - transitStd + 12);
  const deltaMinutes = (12 - transitStd) * 60;
  const deltaSign = deltaMinutes >= 0 ? "+" : "";
  const deltaStr = `${deltaSign}${deltaMinutes.toFixed(1)} mnt`;

  return {
    istiwaTimeStr: formatTime(istiwaHours, true),
    deltaStr,
  };
}
