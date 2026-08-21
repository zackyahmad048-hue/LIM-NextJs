import { unstable_cache } from "next/cache";
import {
  falakPrayerTimeRepository,
  falakQiblaRepository,
  falakHijriCalendarRepository,
  falakHisabRepository,
  falakRukyatRepository,
  falakEclipseRepository,
} from "../infrastructure/repository";
import {
  calculatePrayerTimes,
  calculateQibla as calcQibla,
} from "./engine/prayer-times";
import { gregorianToHijri } from "./engine/hijri";
import type { Coordinate } from "../domain/types";
import type {
  PrayerMethod,
  ObservationStatus,
  RukyatResult,
  EclipseType,
  HijriMethod,
} from "@/generated/client";

const PUBLIC_CACHE_OPTIONS = { revalidate: 3600, tags: ["falak"] as string[] };

const getCachedPrayerTimes = unstable_cache(
  async (
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    dateISO: string,
  ) => {
    const today = new Date(dateISO);
    today.setHours(0, 0, 0, 0);

    let cached = await falakPrayerTimeRepository.findToday(
      latitude,
      longitude,
      method,
    );

    if (!cached || cached.prayerDate.getTime() !== today.getTime()) {
      const times = calculatePrayerTimes(
        { latitude, longitude },
        today,
        method,
      );

      cached = await falakPrayerTimeRepository.create({
        locationName: `${latitude}, ${longitude}`,
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        calculationMethod: method,
        prayerDate: today,
        fajr: times.fajr,
        sunrise: times.sunrise,
        dhuhr: times.dhuhr,
        asr: times.asr,
        maghrib: times.maghrib,
        isha: times.isha,
      });
    }

    return cached;
  },
  ["falak", "prayer-times"],
  PUBLIC_CACHE_OPTIONS,
);

const getCachedQibla = unstable_cache(
  async (latitude: number, longitude: number) => {
    const direction = calcQibla({ latitude, longitude });

    const existing = await falakQiblaRepository.findByCoordinate(
      latitude,
      longitude,
    );
    if (existing) return existing;

    return falakQiblaRepository.create({
      latitude,
      longitude,
      direction,
    });
  },
  ["falak", "qibla"],
  PUBLIC_CACHE_OPTIONS,
);

const getCachedHijri = unstable_cache(
  async (dateISO: string, method: HijriMethod) => {
    const date = new Date(dateISO);
    const hijri = gregorianToHijri(date);

    const existing = await falakHijriCalendarRepository.findByGregorian(
      date,
      method,
    );
    if (existing) return existing;

    return falakHijriCalendarRepository.create({
      gregorianDate: date,
      hijriYear: hijri.year,
      hijriMonth: hijri.month,
      hijriDay: hijri.day,
      method,
    });
  },
  ["falak", "hijri"],
  PUBLIC_CACHE_OPTIONS,
);

const getCachedUpcomingEclipses = unstable_cache(
  async () => falakEclipseRepository.findUpcoming(),
  ["falak", "eclipse-upcoming"],
  PUBLIC_CACHE_OPTIONS,
);

const getCachedEclipsePaginated = unstable_cache(
  async (page: number, limit: number, type: EclipseType | null) =>
    falakEclipseRepository.findPaginated({
      page,
      limit,
      type: type ?? undefined,
    }),
  ["falak", "eclipse-paginated"],
  PUBLIC_CACHE_OPTIONS,
);

export class FalakService {
  async getPrayerTimes(
    coordinate: Coordinate,
    date: Date,
    method: PrayerMethod,
  ) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return getCachedPrayerTimes(
      coordinate.latitude,
      coordinate.longitude,
      method,
      target.toISOString(),
    );
  }

  async calculateQibla(coordinate: Coordinate) {
    return getCachedQibla(coordinate.latitude, coordinate.longitude);
  }

  async convertToHijri(date: Date, method: HijriMethod) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return getCachedHijri(target.toISOString(), method);
  }

  async saveHisab(data: {
    calculationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    parameters: unknown;
    result: unknown;
    calculatedById?: string;
  }) {
    return falakHisabRepository.create(data);
  }

  async getHisabPaginated(page: number, limit: number, search?: string) {
    return falakHisabRepository.findPaginated({ page, limit, search });
  }

  async deleteHisab(id: string) {
    const item = await falakHisabRepository.findById(id);
    if (!item) throw new Error("Data hisab tidak ditemukan.");
    return falakHisabRepository.delete(id);
  }

  async createRukyat(data: {
    observationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    observerId: string;
    weather: string;
    result: RukyatResult;
    notes?: string;
  }) {
    return falakRukyatRepository.create(data);
  }

  async getRukyatPaginated(
    page: number,
    limit: number,
    search?: string,
    status?: ObservationStatus,
  ) {
    return falakRukyatRepository.findPaginated({ page, limit, search, status });
  }

  async verifyRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "DRAFT")
      throw new Error("Observasi hanya dapat diverifikasi dari status Draft.");
    return falakRukyatRepository.verify(id);
  }

  async confirmRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "VERIFIED")
      throw new Error(
        "Observasi hanya dapat dikonfirmasi dari status Verified.",
      );
    return falakRukyatRepository.confirm(id);
  }

  async archiveRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "CONFIRMED")
      throw new Error(
        "Observasi hanya dapat diarsipkan dari status Confirmed.",
      );
    return falakRukyatRepository.archive(id);
  }

  async getUpcomingEclipses() {
    return getCachedUpcomingEclipses();
  }

  async getEclipsePaginated(page: number, limit: number, type?: EclipseType) {
    return getCachedEclipsePaginated(page, limit, type ?? null);
  }

  async createEclipse(data: {
    eclipseType: EclipseType;
    eclipseDate: Date;
    visibility?: string;
    details?: unknown;
  }) {
    return falakEclipseRepository.create(data);
  }
}

export const falakService = new FalakService();
