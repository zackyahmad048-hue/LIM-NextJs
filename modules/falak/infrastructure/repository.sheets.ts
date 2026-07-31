import { randomUUID } from "crypto";

import type {
  FalakPrayerTime as PrismaFalakPrayerTime,
  FalakQibla as PrismaFalakQibla,
  FalakHijriCalendar as PrismaFalakHijriCalendar,
  FalakRukyat as PrismaFalakRukyat,
  FalakEclipse as PrismaFalakEclipse,
  PrayerMethod,
  ObservationStatus,
  RukyatResult,
  EclipseType,
  HijriMethod,
} from "@/generated/client";
import { Prisma } from "@/generated/client";
import {
  googleConfig,
  GoogleApiError,
  SheetsBaseRepository,
  type SheetSchema,
} from "@/modules/shared/infrastructure/google";
import type {
  FalakPrayerTimeRepository,
  FalakQiblaRepository,
  FalakHijriCalendarRepository,
  FalakRukyatRepository,
  FalakEclipseRepository,
} from "../domain/repository";

function falakSpreadsheetId(): string {
  const id = googleConfig.spreadsheetFalakId;
  if (!id) {
    throw new GoogleApiError(
      "UNAUTHENTICATED",
      "GOOGLE_SPREADSHEET_FALAK_ID belum dikonfigurasi."
    );
  }
  return id;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const PRAYER_TIME_HEADERS = [
  "id",
  "locationName",
  "latitude",
  "longitude",
  "timezone",
  "calculationMethod",
  "prayerDate",
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "createdAt",
];

export class SheetsFalakPrayerTimeRepository
  extends SheetsBaseRepository
  implements FalakPrayerTimeRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: falakSpreadsheetId(),
    tab: "PrayerTime",
    headers: PRAYER_TIME_HEADERS,
  };

  private toEntity(row: Record<string, string>): PrismaFalakPrayerTime {
    return {
      id: row.id,
      locationName: row.locationName ?? "",
      latitude: this.toNumber(row.latitude),
      longitude: this.toNumber(row.longitude),
      timezone: row.timezone ?? "",
      calculationMethod: row.calculationMethod as PrayerMethod,
      prayerDate: this.toDate(row.prayerDate, new Date()),
      fajr: this.toDate(row.fajr, new Date()),
      sunrise: this.toDate(row.sunrise, new Date()),
      dhuhr: this.toDate(row.dhuhr, new Date()),
      asr: this.toDate(row.asr, new Date()),
      maghrib: this.toDate(row.maghrib, new Date()),
      isha: this.toDate(row.isha, new Date()),
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  async findToday(latitude: number, longitude: number, method: PrayerMethod) {
    const rows = await this.readAll();
    const now = new Date();
    const matches = rows
      .filter(
        (row) =>
          this.toNumber(row.latitude) === latitude &&
          this.toNumber(row.longitude) === longitude &&
          row.calculationMethod === method &&
          sameDay(this.toDate(row.prayerDate, now), now)
      )
      .sort(
        (a, b) =>
          this.toDate(b.createdAt, now).getTime() - this.toDate(a.createdAt, now).getTime()
      );

    return matches.length ? this.toEntity(matches[0]) : null;
  }

  async findByDateRange(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    start: Date,
    end: Date
  ) {
    const rows = await this.readAll();
    return rows
      .filter((row) => {
        const prayerDate = this.toDate(row.prayerDate, new Date());
        return (
          this.toNumber(row.latitude) === latitude &&
          this.toNumber(row.longitude) === longitude &&
          row.calculationMethod === method &&
          prayerDate >= start &&
          prayerDate <= end
        );
      })
      .sort(
        (a, b) =>
          this.toDate(a.prayerDate, new Date()).getTime() -
          this.toDate(b.prayerDate, new Date()).getTime()
      )
      .map((row) => this.toEntity(row));
  }

  async findRecent(latitude: number, longitude: number, method: PrayerMethod, take = 7) {
    const rows = await this.readAll();
    return rows
      .filter(
        (row) =>
          this.toNumber(row.latitude) === latitude &&
          this.toNumber(row.longitude) === longitude &&
          row.calculationMethod === method
      )
      .sort(
        (a, b) =>
          this.toDate(b.prayerDate, new Date()).getTime() -
          this.toDate(a.prayerDate, new Date()).getTime()
      )
      .slice(0, take)
      .map((row) => this.toEntity(row));
  }

  async findAllByCoordinate(latitude: number, longitude: number, method: PrayerMethod) {
    const rows = await this.readAll();
    return rows
      .filter(
        (row) =>
          this.toNumber(row.latitude) === latitude &&
          this.toNumber(row.longitude) === longitude &&
          row.calculationMethod === method
      )
      .sort(
        (a, b) =>
          this.toDate(b.prayerDate, new Date()).getTime() -
          this.toDate(a.prayerDate, new Date()).getTime()
      )
      .map((row) => this.toEntity(row));
  }

  async create(data: {
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
  }) {
    const id = randomUUID();
    const createdAt = new Date();
    await this.createRow({
      id,
      locationName: data.locationName,
      latitude: this.toNumberString(data.latitude),
      longitude: this.toNumberString(data.longitude),
      timezone: data.timezone,
      calculationMethod: data.calculationMethod,
      prayerDate: data.prayerDate.toISOString(),
      fajr: data.fajr.toISOString(),
      sunrise: data.sunrise.toISOString(),
      dhuhr: data.dhuhr.toISOString(),
      asr: data.asr.toISOString(),
      maghrib: data.maghrib.toISOString(),
      isha: data.isha.toISOString(),
      createdAt: createdAt.toISOString(),
    });

    return { id, ...data, createdAt } as PrismaFalakPrayerTime;
  }
}

const QIBLA_HEADERS = ["id", "latitude", "longitude", "direction", "createdAt"];

export class SheetsFalakQiblaRepository
  extends SheetsBaseRepository
  implements FalakQiblaRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: falakSpreadsheetId(),
    tab: "Qibla",
    headers: QIBLA_HEADERS,
  };

  private toEntity(row: Record<string, string>): PrismaFalakQibla {
    return {
      id: row.id,
      latitude: this.toNumber(row.latitude),
      longitude: this.toNumber(row.longitude),
      direction: this.toNumber(row.direction),
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  async findByCoordinate(latitude: number, longitude: number) {
    const rows = await this.readAll();
    const match = rows.find(
      (row) => this.toNumber(row.latitude) === latitude && this.toNumber(row.longitude) === longitude
    );
    return match ? this.toEntity(match) : null;
  }

  async create(data: { latitude: number; longitude: number; direction: number }) {
    const id = randomUUID();
    const createdAt = new Date();
    await this.createRow({
      id,
      latitude: this.toNumberString(data.latitude),
      longitude: this.toNumberString(data.longitude),
      direction: this.toNumberString(data.direction),
      createdAt: createdAt.toISOString(),
    });

    return { id, ...data, createdAt } as PrismaFalakQibla;
  }
}

const HIJRI_CALENDAR_HEADERS = [
  "id",
  "gregorianDate",
  "hijriYear",
  "hijriMonth",
  "hijriDay",
  "method",
  "createdAt",
];

export class SheetsFalakHijriCalendarRepository
  extends SheetsBaseRepository
  implements FalakHijriCalendarRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: falakSpreadsheetId(),
    tab: "HijriCalendar",
    headers: HIJRI_CALENDAR_HEADERS,
  };

  private toEntity(row: Record<string, string>): PrismaFalakHijriCalendar {
    return {
      id: row.id,
      gregorianDate: this.toDate(row.gregorianDate, new Date()),
      hijriYear: this.toNumber(row.hijriYear),
      hijriMonth: this.toNumber(row.hijriMonth),
      hijriDay: this.toNumber(row.hijriDay),
      method: row.method as HijriMethod,
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  async findByGregorian(date: Date, method: HijriMethod) {
    const rows = await this.readAll();
    const match = rows.find(
      (row) =>
        row.method === method && sameDay(this.toDate(row.gregorianDate, new Date()), date)
    );
    return match ? this.toEntity(match) : null;
  }

  async findByHijri(year: number, month: number, method: HijriMethod) {
    const rows = await this.readAll();
    return rows
      .filter(
        (row) =>
          this.toNumber(row.hijriYear) === year &&
          this.toNumber(row.hijriMonth) === month &&
          row.method === method
      )
      .sort((a, b) => this.toNumber(a.hijriDay) - this.toNumber(b.hijriDay))
      .map((row) => this.toEntity(row));
  }

  async create(data: {
    gregorianDate: Date;
    hijriYear: number;
    hijriMonth: number;
    hijriDay: number;
    method: HijriMethod;
  }) {
    const id = randomUUID();
    const createdAt = new Date();
    await this.createRow({
      id,
      gregorianDate: data.gregorianDate.toISOString(),
      hijriYear: this.toNumberString(data.hijriYear),
      hijriMonth: this.toNumberString(data.hijriMonth),
      hijriDay: this.toNumberString(data.hijriDay),
      method: data.method,
      createdAt: createdAt.toISOString(),
    });

    return { id, ...data, createdAt } as PrismaFalakHijriCalendar;
  }
}

const RUKYAT_HEADERS = [
  "id",
  "observationDate",
  "locationName",
  "latitude",
  "longitude",
  "observerId",
  "weather",
  "result",
  "notes",
  "status",
  "createdAt",
  "deletedAt",
];

export class SheetsFalakRukyatRepository
  extends SheetsBaseRepository
  implements FalakRukyatRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: falakSpreadsheetId(),
    tab: "Rukyat",
    headers: RUKYAT_HEADERS,
  };

  private toEntity(row: Record<string, string>): PrismaFalakRukyat {
    return {
      id: row.id,
      observationDate: this.toDate(row.observationDate, new Date()),
      locationName: row.locationName ?? "",
      latitude: this.toNumber(row.latitude),
      longitude: this.toNumber(row.longitude),
      observerId: row.observerId ?? "",
      weather: row.weather ?? "",
      result: row.result as RukyatResult,
      notes: this.toNullableString(row.notes),
      status: (row.status || "DRAFT") as ObservationStatus,
      createdAt: this.toDate(row.createdAt, new Date()),
      deletedAt: this.toNullableDate(row.deletedAt),
    };
  }

  async findById(id: string) {
    const row = await this.findRowById(id);
    return row ? this.toEntity(row) : null;
  }

  async findPaginated({
    page,
    limit,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: ObservationStatus;
  }) {
    let rows = (await this.readAll()).filter((row) => !row.deletedAt);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => row.locationName.toLowerCase().includes(q));
    }
    if (status) rows = rows.filter((row) => row.status === status);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.createdAt, new Date()).getTime() -
        this.toDate(a.createdAt, new Date()).getTime()
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toEntity(row));

    return { items, total };
  }

  async findByStatus(status: ObservationStatus, take = 50) {
    const rows = await this.readAll();
    return rows
      .filter((row) => !row.deletedAt && row.status === status)
      .sort(
        (a, b) =>
          this.toDate(b.observationDate, new Date()).getTime() -
          this.toDate(a.observationDate, new Date()).getTime()
      )
      .slice(0, take)
      .map((row) => this.toEntity(row));
  }

  async findAll(take = 50) {
    const rows = await this.readAll();
    return rows
      .filter((row) => !row.deletedAt)
      .sort(
        (a, b) =>
          this.toDate(b.observationDate, new Date()).getTime() -
          this.toDate(a.observationDate, new Date()).getTime()
      )
      .slice(0, take)
      .map((row) => this.toEntity(row));
  }

  async create(data: {
    observationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    observerId: string;
    weather: string;
    result: RukyatResult;
    notes?: string;
  }) {
    const id = randomUUID();
    const createdAt = new Date();
    await this.createRow({
      id,
      observationDate: data.observationDate.toISOString(),
      locationName: data.locationName,
      latitude: this.toNumberString(data.latitude),
      longitude: this.toNumberString(data.longitude),
      observerId: data.observerId,
      weather: data.weather,
      result: data.result,
      notes: data.notes ?? "",
      status: "DRAFT",
      createdAt: createdAt.toISOString(),
      deletedAt: "",
    });

    return {
      id,
      ...data,
      notes: data.notes ?? null,
      status: "DRAFT" as ObservationStatus,
      createdAt,
      deletedAt: null,
    } as PrismaFalakRukyat;
  }

  async verify(id: string) {
    await this.updateRow(id, { status: "VERIFIED" });
    return (await this.findById(id)) as PrismaFalakRukyat;
  }

  async confirm(id: string) {
    await this.updateRow(id, { status: "CONFIRMED" });
    return (await this.findById(id)) as PrismaFalakRukyat;
  }

  async archive(id: string) {
    await this.updateRow(id, { status: "ARCHIVED" });
    return (await this.findById(id)) as PrismaFalakRukyat;
  }

  async restore(id: string) {
    await this.updateRow(id, { status: "DRAFT" });
    return (await this.findById(id)) as PrismaFalakRukyat;
  }
}

const ECLIPSE_HEADERS = [
  "id",
  "eclipseType",
  "eclipseDate",
  "visibility",
  "details",
  "createdAt",
];

export class SheetsFalakEclipseRepository
  extends SheetsBaseRepository
  implements FalakEclipseRepository
{
  protected readonly schema: SheetSchema = {
    spreadsheetId: falakSpreadsheetId(),
    tab: "Eclipse",
    headers: ECLIPSE_HEADERS,
  };

  private toEntity(row: Record<string, string>): PrismaFalakEclipse {
    return {
      id: row.id,
      eclipseType: row.eclipseType as EclipseType,
      eclipseDate: this.toDate(row.eclipseDate, new Date()),
      visibility: this.toNullableString(row.visibility),
      details: row.details ? (JSON.parse(row.details) as Prisma.JsonValue) : null,
      createdAt: this.toDate(row.createdAt, new Date()),
    };
  }

  async findUpcoming() {
    const now = new Date();
    const rows = await this.readAll();
    return rows
      .filter((row) => this.toDate(row.eclipseDate, now) >= now)
      .sort(
        (a, b) =>
          this.toDate(a.eclipseDate, now).getTime() - this.toDate(b.eclipseDate, now).getTime()
      )
      .slice(0, 5)
      .map((row) => this.toEntity(row));
  }

  async findPast(take = 10) {
    const now = new Date();
    const rows = await this.readAll();
    return rows
      .filter((row) => this.toDate(row.eclipseDate, now) < now)
      .sort(
        (a, b) =>
          this.toDate(b.eclipseDate, now).getTime() - this.toDate(a.eclipseDate, now).getTime()
      )
      .slice(0, take)
      .map((row) => this.toEntity(row));
  }

  async findById(id: string) {
    const row = await this.findRowById(id);
    return row ? this.toEntity(row) : null;
  }

  async findPaginated({
    page,
    limit,
    type,
  }: {
    page: number;
    limit: number;
    type?: EclipseType;
  }) {
    let rows = await this.readAll();
    if (type) rows = rows.filter((row) => row.eclipseType === type);

    rows = rows.sort(
      (a, b) =>
        this.toDate(b.eclipseDate, new Date()).getTime() -
        this.toDate(a.eclipseDate, new Date()).getTime()
    );

    const total = rows.length;
    const items = rows
      .slice((page - 1) * limit, page * limit)
      .map((row) => this.toEntity(row));

    return { items, total };
  }

  async create(data: {
    eclipseType: EclipseType;
    eclipseDate: Date;
    visibility?: string;
    details?: unknown;
  }) {
    const id = randomUUID();
    const createdAt = new Date();
    await this.createRow({
      id,
      eclipseType: data.eclipseType,
      eclipseDate: data.eclipseDate.toISOString(),
      visibility: data.visibility ?? "",
      details: this.toJsonString(data.details),
      createdAt: createdAt.toISOString(),
    });

    return {
      id,
      ...data,
      details: data.details ?? null,
      createdAt,
    } as PrismaFalakEclipse;
  }
}
