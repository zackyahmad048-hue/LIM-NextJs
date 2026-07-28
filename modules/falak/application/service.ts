import {
  falakPrayerTimeRepository,
  falakQiblaRepository,
  falakHijriCalendarRepository,
  falakHisabRepository,
  falakRukyatRepository,
  falakEclipseRepository,
} from "../infrastructure/repository";
import { calculatePrayerTimes, calculateQibla as calcQibla } from "./engine/prayer-times";
import { gregorianToHijri } from "./engine/hijri";
import type { Coordinate } from "../domain/types";
import type { PrayerMethod, ObservationStatus, RukyatResult, EclipseType, HijriMethod } from "@/generated/client";

export class FalakService {
  async getPrayerTimes(coordinate: Coordinate, date: Date, method: PrayerMethod) {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    let cached = await falakPrayerTimeRepository.findToday(
      coordinate.latitude,
      coordinate.longitude,
      method
    );

    if (!cached || cached.prayerDate.getTime() !== today.getTime()) {
      const times = calculatePrayerTimes(coordinate, today, method);

      cached = await falakPrayerTimeRepository.create({
        locationName: `${coordinate.latitude}, ${coordinate.longitude}`,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
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
  }

  async calculateQibla(coordinate: Coordinate) {
    const direction = calcQibla(coordinate);

    const existing = await falakQiblaRepository.findByCoordinate(
      coordinate.latitude,
      coordinate.longitude
    );

    if (existing) return existing;

    return falakQiblaRepository.create({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      direction,
    });
  }

  async convertToHijri(date: Date, method: HijriMethod) {
    const hijri = gregorianToHijri(date);

    const existing = await falakHijriCalendarRepository.findByGregorian(date, method);
    if (existing) return existing;

    return falakHijriCalendarRepository.create({
      gregorianDate: date,
      hijriYear: hijri.year,
      hijriMonth: hijri.month,
      hijriDay: hijri.day,
      method,
    });
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

  async getRukyatPaginated(page: number, limit: number, search?: string, status?: ObservationStatus) {
    return falakRukyatRepository.findPaginated({ page, limit, search, status });
  }

  async verifyRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "DRAFT") throw new Error("Observasi hanya dapat diverifikasi dari status Draft.");
    return falakRukyatRepository.verify(id);
  }

  async confirmRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "VERIFIED") throw new Error("Observasi hanya dapat dikonfirmasi dari status Verified.");
    return falakRukyatRepository.confirm(id);
  }

  async archiveRukyat(id: string) {
    const item = await falakRukyatRepository.findById(id);
    if (!item) throw new Error("Observasi tidak ditemukan.");
    if (item.status !== "CONFIRMED") throw new Error("Observasi hanya dapat diarsipkan dari status Confirmed.");
    return falakRukyatRepository.archive(id);
  }

  async getUpcomingEclipses() {
    return falakEclipseRepository.findUpcoming();
  }

  async getEclipsePaginated(page: number, limit: number, type?: EclipseType) {
    return falakEclipseRepository.findPaginated({ page, limit, type });
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
