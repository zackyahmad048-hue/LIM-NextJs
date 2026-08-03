import { Prisma } from "@/generated/client";

import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import {
  SheetsFalakEclipseRepository,
  SheetsFalakHijriCalendarRepository,
  SheetsFalakPrayerTimeRepository,
  SheetsFalakQiblaRepository,
  SheetsFalakRukyatRepository,
} from "./repository.sheets";
import type {
  FalakPrayerTimeRepository,
  FalakQiblaRepository,
  FalakHijriCalendarRepository,
  FalakHisabRepository,
  FalakRukyatRepository,
  FalakEclipseRepository,
} from "../domain/repository";
import type {
  PrayerMethod,
  ObservationStatus,
  EclipseType,
  HijriMethod,
} from "../domain/types";

export class PrismaFalakPrayerTimeRepository
  extends BaseRepository
  implements FalakPrayerTimeRepository
{
  async findToday(latitude: number, longitude: number, method: PrayerMethod) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.db.falakPrayerTime.findFirst({
      where: {
        latitude,
        longitude,
        calculationMethod: method,
        prayerDate: today,
      },
    });
  }

  async findByDateRange(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    start: Date,
    end: Date,
  ) {
    return this.db.falakPrayerTime.findMany({
      where: {
        latitude,
        longitude,
        calculationMethod: method,
        prayerDate: { gte: start, lte: end },
      },
      orderBy: { prayerDate: "asc" },
    });
  }

  async findRecent(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    take = 7,
  ) {
    return this.db.falakPrayerTime.findMany({
      where: { latitude, longitude, calculationMethod: method },
      orderBy: { prayerDate: "desc" },
      take,
    });
  }

  async findAllByCoordinate(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
  ) {
    return this.db.falakPrayerTime.findMany({
      where: { latitude, longitude, calculationMethod: method },
      orderBy: { prayerDate: "desc" },
    });
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
    return this.db.falakPrayerTime.create({ data });
  }
}

export class PrismaFalakQiblaRepository
  extends BaseRepository
  implements FalakQiblaRepository
{
  async findByCoordinate(latitude: number, longitude: number) {
    return this.db.falakQibla.findFirst({
      where: { latitude, longitude },
    });
  }

  async create(data: {
    latitude: number;
    longitude: number;
    direction: number;
  }) {
    return this.db.falakQibla.create({ data });
  }
}

export class PrismaFalakHijriCalendarRepository
  extends BaseRepository
  implements FalakHijriCalendarRepository
{
  async findByGregorian(date: Date, method: HijriMethod) {
    return this.db.falakHijriCalendar.findFirst({
      where: { gregorianDate: date, method },
    });
  }

  async findByHijri(year: number, month: number, method: HijriMethod) {
    return this.db.falakHijriCalendar.findMany({
      where: { hijriYear: year, hijriMonth: month, method },
      orderBy: { hijriDay: "asc" },
    });
  }

  async create(data: {
    gregorianDate: Date;
    hijriYear: number;
    hijriMonth: number;
    hijriDay: number;
    method: HijriMethod;
  }) {
    return this.db.falakHijriCalendar.create({ data });
  }
}

export class PrismaFalakHisabRepository
  extends BaseRepository
  implements FalakHisabRepository
{
  async findById(id: string) {
    return this.db.falakHisab.findUnique({ where: { id } });
  }

  async findPaginated({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const where: Prisma.FalakHisabWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [{ locationName: { contains: search, mode: "insensitive" } }];
    }

    const [items, total] = await Promise.all([
      this.db.falakHisab.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.falakHisab.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: {
    calculationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    parameters: unknown;
    result: unknown;
    calculatedById?: string;
  }) {
    return this.db.falakHisab.create({
      data: {
        ...data,
        parameters: data.parameters as Prisma.InputJsonValue,
        result: data.result as Prisma.InputJsonValue,
      },
    });
  }

  async delete(id: string) {
    await this.db.falakHisab.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class PrismaFalakRukyatRepository
  extends BaseRepository
  implements FalakRukyatRepository
{
  async findById(id: string) {
    return this.db.falakRukyat.findUnique({ where: { id } });
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
    const where: Prisma.FalakRukyatWhereInput = { deletedAt: null };

    if (search) {
      where.OR = [{ locationName: { contains: search, mode: "insensitive" } }];
    }
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.db.falakRukyat.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.falakRukyat.count({ where }),
    ]);

    return { items, total };
  }

  async findByStatus(status: ObservationStatus, take = 50) {
    return this.db.falakRukyat.findMany({
      where: { status },
      orderBy: { observationDate: "desc" },
      take,
    });
  }

  async findAll(take = 50) {
    return this.db.falakRukyat.findMany({
      orderBy: { observationDate: "desc" },
      take,
    });
  }

  async create(data: {
    observationDate: Date;
    locationName: string;
    latitude: number;
    longitude: number;
    observerId: string;
    weather: string;
    result: import("@/generated/client").RukyatResult;
    notes?: string;
  }) {
    return this.db.falakRukyat.create({ data });
  }

  async verify(id: string) {
    return this.db.falakRukyat.update({
      where: { id },
      data: { status: "VERIFIED" },
    });
  }

  async confirm(id: string) {
    return this.db.falakRukyat.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });
  }

  async archive(id: string) {
    return this.db.falakRukyat.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  }

  async restore(id: string) {
    return this.db.falakRukyat.update({
      where: { id },
      data: { status: "DRAFT" },
    });
  }
}

export class PrismaFalakEclipseRepository
  extends BaseRepository
  implements FalakEclipseRepository
{
  async findUpcoming() {
    return this.db.falakEclipse.findMany({
      where: { eclipseDate: { gte: new Date() } },
      orderBy: { eclipseDate: "asc" },
      take: 5,
    });
  }

  async findPast(take = 10) {
    return this.db.falakEclipse.findMany({
      where: { eclipseDate: { lt: new Date() } },
      orderBy: { eclipseDate: "desc" },
      take,
    });
  }

  async findById(id: string) {
    return this.db.falakEclipse.findUnique({ where: { id } });
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
    const where: Prisma.FalakEclipseWhereInput = {};

    if (type) where.eclipseType = type;

    const [items, total] = await Promise.all([
      this.db.falakEclipse.findMany({
        where,
        orderBy: { eclipseDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.falakEclipse.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: {
    eclipseType: import("@/generated/client").EclipseType;
    eclipseDate: Date;
    visibility?: string;
    details?: unknown;
  }) {
    return this.db.falakEclipse.create({
      data: { ...data, details: data.details as Prisma.InputJsonValue },
    });
  }
}

export const prismaFalakPrayerTimeRepository =
  new PrismaFalakPrayerTimeRepository();
export const prismaFalakQiblaRepository = new PrismaFalakQiblaRepository();
export const prismaFalakHijriCalendarRepository =
  new PrismaFalakHijriCalendarRepository();
export const prismaFalakHisabRepository = new PrismaFalakHisabRepository();
export const prismaFalakRukyatRepository = new PrismaFalakRukyatRepository();
export const prismaFalakEclipseRepository = new PrismaFalakEclipseRepository();

export const falakHisabRepository = prismaFalakHisabRepository;

const useSheets = process.env.DATA_SOURCE === "sheets";

export const falakPrayerTimeRepository: FalakPrayerTimeRepository = useSheets
  ? new SheetsFalakPrayerTimeRepository()
  : prismaFalakPrayerTimeRepository;
export const falakQiblaRepository: FalakQiblaRepository = useSheets
  ? new SheetsFalakQiblaRepository()
  : prismaFalakQiblaRepository;
export const falakHijriCalendarRepository: FalakHijriCalendarRepository =
  useSheets
    ? new SheetsFalakHijriCalendarRepository()
    : prismaFalakHijriCalendarRepository;
export const falakRukyatRepository: FalakRukyatRepository = useSheets
  ? new SheetsFalakRukyatRepository()
  : prismaFalakRukyatRepository;
export const falakEclipseRepository: FalakEclipseRepository = useSheets
  ? new SheetsFalakEclipseRepository()
  : prismaFalakEclipseRepository;
