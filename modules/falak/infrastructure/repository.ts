import type {
  FalakEclipse,
  FalakHijriCalendar,
  FalakHisab,
  FalakPrayerTime as PayloadFalakPrayerTime,
  FalakQibla,
  FalakRukyat,
} from "@/payload-types";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
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

type PrismaPrayerTime = import("@/generated/client").FalakPrayerTime;
type PrismaQibla = import("@/generated/client").FalakQibla;
type PrismaHijri = import("@/generated/client").FalakHijriCalendar;
type PrismaHisab = import("@/generated/client").FalakHisab;
type PrismaRukyat = import("@/generated/client").FalakRukyat;
type PrismaEclipse = import("@/generated/client").FalakEclipse;

function mapPrayerTime(doc: PayloadFalakPrayerTime): PrismaPrayerTime {
  return {
    id: String(doc.id),
    locationName: doc.locationName,
    latitude: doc.latitude,
    longitude: doc.longitude,
    timezone: doc.timezone,
    calculationMethod: doc.calculationMethod,
    prayerDate: new Date(doc.prayerDate),
    fajr: new Date(doc.fajr),
    sunrise: new Date(doc.sunrise),
    dhuhr: new Date(doc.dhuhr),
    asr: new Date(doc.asr),
    maghrib: new Date(doc.maghrib),
    isha: new Date(doc.isha),
    createdAt: new Date(doc.createdAt),
  };
}

function mapQibla(doc: FalakQibla): PrismaQibla {
  return {
    id: String(doc.id),
    latitude: doc.latitude,
    longitude: doc.longitude,
    direction: doc.direction,
    createdAt: new Date(doc.createdAt),
  };
}

function mapHijri(doc: FalakHijriCalendar): PrismaHijri {
  return {
    id: String(doc.id),
    gregorianDate: new Date(doc.gregorianDate),
    hijriYear: doc.hijriYear,
    hijriMonth: doc.hijriMonth,
    hijriDay: doc.hijriDay,
    method: doc.method,
    createdAt: new Date(doc.createdAt),
  };
}

function mapHisab(doc: FalakHisab): PrismaHisab {
  return {
    id: String(doc.id),
    calculationDate: new Date(doc.calculationDate),
    locationName: doc.locationName,
    latitude: doc.latitude,
    longitude: doc.longitude,
    parameters: doc.parameters as PrismaHisab["parameters"],
    result: doc.result as PrismaHisab["result"],
    calculatedById: doc.calculatedById ?? null,
    createdAt: new Date(doc.createdAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

function mapRukyat(doc: FalakRukyat): PrismaRukyat {
  return {
    id: String(doc.id),
    observationDate: new Date(doc.observationDate),
    locationName: doc.locationName,
    latitude: doc.latitude,
    longitude: doc.longitude,
    observerId: doc.observerId,
    weather: doc.weather,
    result: doc.result,
    notes: doc.notes ?? null,
    status: doc.status,
    createdAt: new Date(doc.createdAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

function mapEclipse(doc: FalakEclipse): PrismaEclipse {
  return {
    id: String(doc.id),
    eclipseType: doc.eclipseType,
    eclipseDate: new Date(doc.eclipseDate),
    visibility: doc.visibility ?? null,
    details: (doc.details ?? null) as PrismaEclipse["details"],
    createdAt: new Date(doc.createdAt),
  };
}

export class PayloadFalakPrayerTimeRepository
  implements FalakPrayerTimeRepository
{
  private coordinateWhere(latitude: number, longitude: number, method: PrayerMethod) {
    return {
      and: [
        { latitude: { equals: latitude } },
        { longitude: { equals: longitude } },
        { calculationMethod: { equals: method } },
      ],
    };
  }

  async findToday(latitude: number, longitude: number, method: PrayerMethod) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-prayer-times",
      where: {
        and: [
          ...(this.coordinateWhere(latitude, longitude, method).and as never[]),
          { prayerDate: { equals: today.toISOString() } },
        ],
      } as never,
      limit: 1,
      depth: 0,
    });
    return res.docs[0] ? mapPrayerTime(res.docs[0]) : null;
  }

  async findByDateRange(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    start: Date,
    end: Date,
  ) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-prayer-times",
      where: {
        and: [
          ...(this.coordinateWhere(latitude, longitude, method).and as never[]),
          { prayerDate: { greater_than_equal: start.toISOString() } },
          { prayerDate: { less_than_equal: end.toISOString() } },
        ],
      } as never,
      sort: "prayerDate",
      limit: 10000,
      depth: 0,
    });
    return res.docs.map(mapPrayerTime);
  }

  async findRecent(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
    take = 7,
  ) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-prayer-times",
      where: this.coordinateWhere(latitude, longitude, method) as never,
      sort: "-prayerDate",
      limit: take,
      depth: 0,
    });
    return res.docs.map(mapPrayerTime);
  }

  async findAllByCoordinate(
    latitude: number,
    longitude: number,
    method: PrayerMethod,
  ) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-prayer-times",
      where: this.coordinateWhere(latitude, longitude, method) as never,
      sort: "-prayerDate",
      limit: 10000,
      depth: 0,
    });
    return res.docs.map(mapPrayerTime);
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
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-prayer-times",
      data: {
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        calculationMethod: data.calculationMethod,
        prayerDate: data.prayerDate.toISOString(),
        fajr: data.fajr.toISOString(),
        sunrise: data.sunrise.toISOString(),
        dhuhr: data.dhuhr.toISOString(),
        asr: data.asr.toISOString(),
        maghrib: data.maghrib.toISOString(),
        isha: data.isha.toISOString(),
      },
    });
    return mapPrayerTime(doc);
  }
}

export class PayloadFalakQiblaRepository implements FalakQiblaRepository {
  async findByCoordinate(latitude: number, longitude: number) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-qiblas",
      where: {
        and: [
          { latitude: { equals: latitude } },
          { longitude: { equals: longitude } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    return res.docs[0] ? mapQibla(res.docs[0]) : null;
  }

  async create(data: {
    latitude: number;
    longitude: number;
    direction: number;
  }) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-qiblas",
      data,
    });
    return mapQibla(doc);
  }
}

export class PayloadFalakHijriCalendarRepository
  implements FalakHijriCalendarRepository
{
  async findByGregorian(date: Date, method: HijriMethod) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-hijri-calendars",
      where: {
        and: [
          { gregorianDate: { equals: date.toISOString() } },
          { method: { equals: method } },
        ],
      },
      limit: 1,
      depth: 0,
    });
    return res.docs[0] ? mapHijri(res.docs[0]) : null;
  }

  async findByHijri(year: number, month: number, method: HijriMethod) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-hijri-calendars",
      where: {
        and: [
          { hijriYear: { equals: year } },
          { hijriMonth: { equals: month } },
          { method: { equals: method } },
        ],
      },
      sort: "hijriDay",
      limit: 10000,
      depth: 0,
    });
    return res.docs.map(mapHijri);
  }

  async create(data: {
    gregorianDate: Date;
    hijriYear: number;
    hijriMonth: number;
    hijriDay: number;
    method: HijriMethod;
  }) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-hijri-calendars",
      data: {
        gregorianDate: data.gregorianDate.toISOString(),
        hijriYear: data.hijriYear,
        hijriMonth: data.hijriMonth,
        hijriDay: data.hijriDay,
        method: data.method,
      },
    });
    return mapHijri(doc);
  }
}

export class PayloadFalakHisabRepository implements FalakHisabRepository {
  async findById(id: string) {
    const payload = await getPayloadClient();
    try {
      const doc = await payload.findByID({
        collection: "falak-hisabs",
        id: Number(id),
        depth: 0,
      });
      return mapHisab(doc);
    } catch {
      return null;
    }
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
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-hisabs",
      where: search
        ? {
            and: [
              { deletedAt: { exists: false } },
              { locationName: { like: search } },
            ],
          }
        : { deletedAt: { exists: false } },
      sort: "-createdAt",
      page,
      limit,
      depth: 0,
    });
    return { items: res.docs.map(mapHisab), total: res.totalDocs };
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
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-hisabs",
      data: {
        calculationDate: data.calculationDate.toISOString(),
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        parameters: data.parameters as FalakHisab["parameters"],
        result: data.result as FalakHisab["result"],
        calculatedById: data.calculatedById,
      },
    });
    return mapHisab(doc);
  }

  async delete(id: string) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "falak-hisabs",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  }
}

export class PayloadFalakRukyatRepository implements FalakRukyatRepository {
  async findById(id: string) {
    const payload = await getPayloadClient();
    try {
      const doc = await payload.findByID({
        collection: "falak-rukyats",
        id: Number(id),
        depth: 0,
      });
      return mapRukyat(doc);
    } catch {
      return null;
    }
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: ObservationStatus;
  }) {
    const payload = await getPayloadClient();
    const conditions: Record<string, unknown>[] = [
      { deletedAt: { exists: false } },
    ];
    if (params.search) {
      conditions.push({ locationName: { like: params.search } });
    }
    if (params.status) {
      conditions.push({ status: { equals: params.status } });
    }
    const res = await payload.find({
      collection: "falak-rukyats",
      where:
        conditions.length > 1
          ? ({ and: conditions } as never)
          : (conditions[0] as never),
      sort: "-createdAt",
      page: params.page,
      limit: params.limit,
      depth: 0,
    });
    return { items: res.docs.map(mapRukyat), total: res.totalDocs };
  }

  async findByStatus(status: ObservationStatus, take = 50) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-rukyats",
      where: { status: { equals: status } },
      sort: "-observationDate",
      limit: take,
      depth: 0,
    });
    return res.docs.map(mapRukyat);
  }

  async findAll(take = 50) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-rukyats",
      sort: "-observationDate",
      limit: take,
      depth: 0,
    });
    return res.docs.map(mapRukyat);
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
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-rukyats",
      data: {
        observationDate: data.observationDate.toISOString(),
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        observerId: data.observerId,
        weather: data.weather,
        result: data.result,
        notes: data.notes ?? null,
        status: "DRAFT",
      },
    });
    return mapRukyat(doc);
  }

  private async updateStatus(
    id: string,
    status: ObservationStatus,
  ): Promise<PrismaRukyat> {
    const payload = await getPayloadClient();
    const doc = await payload.update({
      collection: "falak-rukyats",
      id: Number(id),
      data: { status },
    });
    return mapRukyat(doc);
  }

  async verify(id: string) {
    return this.updateStatus(id, "VERIFIED");
  }

  async confirm(id: string) {
    return this.updateStatus(id, "CONFIRMED");
  }

  async archive(id: string) {
    return this.updateStatus(id, "ARCHIVED");
  }

  async restore(id: string) {
    return this.updateStatus(id, "DRAFT");
  }
}

export class PayloadFalakEclipseRepository implements FalakEclipseRepository {
  async findUpcoming() {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-eclipses",
      where: { eclipseDate: { greater_than_equal: new Date().toISOString() } },
      sort: "eclipseDate",
      limit: 5,
      depth: 0,
    });
    return res.docs.map(mapEclipse);
  }

  async findPast(take = 10) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-eclipses",
      where: { eclipseDate: { less_than: new Date().toISOString() } },
      sort: "-eclipseDate",
      limit: take,
      depth: 0,
    });
    return res.docs.map(mapEclipse);
  }

  async findById(id: string) {
    const payload = await getPayloadClient();
    try {
      const doc = await payload.findByID({
        collection: "falak-eclipses",
        id: Number(id),
        depth: 0,
      });
      return mapEclipse(doc);
    } catch {
      return null;
    }
  }

  async findPaginated(params: {
    page: number;
    limit: number;
    type?: EclipseType;
  }) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "falak-eclipses",
      where: params.type
        ? ({ eclipseType: { equals: params.type } } as never)
        : undefined,
      sort: "-eclipseDate",
      page: params.page,
      limit: params.limit,
      depth: 0,
    });
    return { items: res.docs.map(mapEclipse), total: res.totalDocs };
  }

  async create(data: {
    eclipseType: import("@/generated/client").EclipseType;
    eclipseDate: Date;
    visibility?: string;
    details?: unknown;
  }) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "falak-eclipses",
      data: {
        eclipseType: data.eclipseType,
        eclipseDate: data.eclipseDate.toISOString(),
        visibility: data.visibility,
        details: data.details as FalakEclipse["details"],
      },
    });
    return mapEclipse(doc);
  }
}

export const falakHisabRepository = new PayloadFalakHisabRepository();

export const falakPrayerTimeRepository: FalakPrayerTimeRepository =
  new PayloadFalakPrayerTimeRepository();
export const falakQiblaRepository: FalakQiblaRepository =
  new PayloadFalakQiblaRepository();
export const falakHijriCalendarRepository: FalakHijriCalendarRepository =
  new PayloadFalakHijriCalendarRepository();
export const falakRukyatRepository: FalakRukyatRepository =
  new PayloadFalakRukyatRepository();
export const falakEclipseRepository: FalakEclipseRepository =
  new PayloadFalakEclipseRepository();
