// Domain
export type { Coordinate, PrayerTimeResult, HijriDate } from "./domain/types";
export type {
  PrayerMethod,
  ObservationStatus,
  RukyatResult,
  EclipseType,
  HijriMethod,
} from "./domain/types";
export { FalakPrayerTime, FalakRukyat } from "./domain/entities";

// Application
export { falakService, FalakService } from "./application/service";
export {
  calculatePrayerTimes,
  calculatePrayerTimesForMonth,
  calculateQibla,
} from "./application/engine/prayer-times";
export {
  gregorianToHijri,
  hijriMonthName,
  hijriDateToString,
} from "./application/engine/hijri";

// Infrastructure
export {
  PrismaFalakPrayerTimeRepository,
  PrismaFalakQiblaRepository,
  PrismaFalakHijriCalendarRepository,
  PrismaFalakHisabRepository,
  PrismaFalakRukyatRepository,
  PrismaFalakEclipseRepository,
  falakPrayerTimeRepository,
  falakQiblaRepository,
  falakHijriCalendarRepository,
  falakHisabRepository,
  falakRukyatRepository,
  falakEclipseRepository,
} from "./infrastructure/repository";

// Validators
export {
  coordinateSchema,
  prayerTimeQuerySchema,
  qiblaQuerySchema,
  hijriQuerySchema,
  hisabInputSchema,
  rukyatInputSchema,
  eclipseInputSchema,
} from "./validations/schema";
export type {
  PrayerTimeQuery,
  QiblaQuery,
  HijriQuery,
  HisabInput,
  RukyatInput,
  EclipseInput,
} from "./validations/schema";
