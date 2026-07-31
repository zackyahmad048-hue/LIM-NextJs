import type {
  FalakPrayerTime as PrismaFalakPrayerTime,
  FalakQibla as PrismaFalakQibla,
  FalakHijriCalendar as PrismaFalakHijriCalendar,
  FalakHisab as PrismaFalakHisab,
  FalakRukyat as PrismaFalakRukyat,
  FalakEclipse as PrismaFalakEclipse,
  Imsakiyah as PrismaImsakiyah,
  PrayerMethod,
  ObservationStatus,
  RukyatResult,
  EclipseType,
  HijriMethod,
} from "@/generated/client";

export interface FalakPrayerTimeRepository {
  findToday(latitude: number, longitude: number, method: PrayerMethod): Promise<PrismaFalakPrayerTime | null>;
  findByDateRange(latitude: number, longitude: number, method: PrayerMethod, start: Date, end: Date): Promise<PrismaFalakPrayerTime[]>;
  findRecent(latitude: number, longitude: number, method: PrayerMethod, take?: number): Promise<PrismaFalakPrayerTime[]>;
  findAllByCoordinate(latitude: number, longitude: number, method: PrayerMethod): Promise<PrismaFalakPrayerTime[]>;
  create(data: {
    locationName: string;
    latitude: number;
    longitude: number;
    timezone: string;
    calculationMethod: PrayerMethod;
    prayerDate: Date;
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  }): Promise<PrismaFalakPrayerTime>;
}

export interface FalakQiblaRepository {
  findByCoordinate(latitude: number, longitude: number): Promise<PrismaFalakQibla | null>;
  create(data: {
    latitude: number;
    longitude: number;
    direction: number;
  }): Promise<PrismaFalakQibla>;
}

export interface FalakHijriCalendarRepository {
  findByGregorian(date: Date, method: HijriMethod): Promise<PrismaFalakHijriCalendar | null>;
  findByHijri(year: number, month: number, method: HijriMethod): Promise<PrismaFalakHijriCalendar[]>;
  create(data: {
    gregorianDate: Date;
    hijriYear: number;
    hijriMonth: number;
    hijriDay: number;
    method: HijriMethod;
  }): Promise<PrismaFalakHijriCalendar>;
}

export interface FalakHisabRepository {
  findById(id: string): Promise<PrismaFalakHisab | null>;
  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ items: PrismaFalakHisab[]; total: number }>;
  create(data: {
    calculationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    parameters: unknown;
    result: unknown;
    calculatedById?: string;
  }): Promise<PrismaFalakHisab>;
  delete(id: string): Promise<void>;
}

export interface FalakRukyatRepository {
  findById(id: string): Promise<PrismaFalakRukyat | null>;
  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ObservationStatus;
  }): Promise<{ items: PrismaFalakRukyat[]; total: number }>;
  findByStatus(status: ObservationStatus, take?: number): Promise<PrismaFalakRukyat[]>;
  findAll(take?: number): Promise<PrismaFalakRukyat[]>;
  create(data: {
    observationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    observerId: string;
    weather: string;
    result: RukyatResult;
    notes?: string;
  }): Promise<PrismaFalakRukyat>;
  verify(id: string): Promise<PrismaFalakRukyat>;
  confirm(id: string): Promise<PrismaFalakRukyat>;
  archive(id: string): Promise<PrismaFalakRukyat>;
  restore(id: string): Promise<PrismaFalakRukyat>;
}

export interface FalakEclipseRepository {
  findUpcoming(): Promise<PrismaFalakEclipse[]>;
  findPast(take?: number): Promise<PrismaFalakEclipse[]>;
  findById(id: string): Promise<PrismaFalakEclipse | null>;
  findPaginated(params: {
    page: number;
    limit: number;
    type?: EclipseType;
  }): Promise<{ items: PrismaFalakEclipse[]; total: number }>;
  create(data: {
    eclipseType: EclipseType;
    eclipseDate: Date;
    visibility?: string;
    details?: unknown;
  }): Promise<PrismaFalakEclipse>;
}

export interface ImsakiyahRepository {
  findAll(): Promise<PrismaImsakiyah[]>;
  findByYear(year: number): Promise<PrismaImsakiyah[]>;
  count(): Promise<number>;
}
