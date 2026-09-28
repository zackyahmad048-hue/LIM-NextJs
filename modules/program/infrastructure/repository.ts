import type { Where } from "payload";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  Attendance,
  Participant,
  Program,
  ProgramCommittee,
  ProgramDocumentation,
  ProgramSchedule,
} from "@/payload-types";
import type {
  ProgramEntity,
  ProgramScheduleEntity,
  ProgramCommitteeEntity,
  ParticipantEntity,
  AttendanceEntity,
  ProgramDocumentationEntity,
} from "../domain/entities";
import type { ProgramRepository } from "../domain/repository";

function mapProgram(doc: Program): ProgramEntity {
  return {
    id: String(doc.id),
    code: doc.code,
    name: doc.name,
    type: doc.type,
    description: doc.description ?? null,
    organizerId: doc.organizerId ?? null,
    personInChargeId: doc.personInChargeId ?? null,
    status: doc.status,
    registrationOpen: doc.registrationOpen
      ? new Date(doc.registrationOpen)
      : null,
    registrationClose: doc.registrationClose
      ? new Date(doc.registrationClose)
      : null,
    startDate: new Date(doc.startDate),
    endDate: new Date(doc.endDate),
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

function mapProgramSchedule(doc: ProgramSchedule): ProgramScheduleEntity {
  return {
    id: String(doc.id),
    programId:
      typeof doc.program === "number"
        ? String(doc.program)
        : String(doc.program.id),
    title: doc.title,
    venueId: doc.venueId ?? null,
    startTime: new Date(doc.startTime),
    endTime: new Date(doc.endTime),
    description: doc.description ?? null,
  };
}

type ProgramWriteData = Partial<{
  code: string;
  name: string;
  type: string;
  description: string | null;
  organizerId: string | null;
  personInChargeId: string | null;
  status: Program["status"];
  registrationOpen: string | null;
  registrationClose: string | null;
  startDate: string;
  endDate: string;
  deletedAt: string | null;
}>;

function programWriteData(
  data: Partial<
    Omit<ProgramEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
  > & { deletedAt?: Date | null },
): ProgramWriteData {
  const out: ProgramWriteData = {};
  if (data.code !== undefined) out.code = data.code;
  if (data.name !== undefined) out.name = data.name;
  if (data.type !== undefined) out.type = data.type;
  if (data.description !== undefined) out.description = data.description;
  if (data.organizerId !== undefined) out.organizerId = data.organizerId;
  if (data.personInChargeId !== undefined)
    out.personInChargeId = data.personInChargeId;
  if (data.status !== undefined) out.status = data.status;
  if (data.registrationOpen !== undefined)
    out.registrationOpen = data.registrationOpen
      ? data.registrationOpen.toISOString()
      : null;
  if (data.registrationClose !== undefined)
    out.registrationClose = data.registrationClose
      ? data.registrationClose.toISOString()
      : null;
  if (data.startDate !== undefined)
    out.startDate = data.startDate.toISOString();
  if (data.endDate !== undefined) out.endDate = data.endDate.toISOString();
  if (data.deletedAt !== undefined)
    out.deletedAt = data.deletedAt ? data.deletedAt.toISOString() : null;
  return out;
}

function relId(value: number | Program | Participant): string {
  return typeof value === "number" ? String(value) : String(value.id);
}

async function resolveProgramUsers(ids: string[]) {
  const unique = [...new Set(ids)];
  if (unique.length === 0) {
    return new Map<
      string,
      { id: string; name: string; email: string; image: string | null }
    >();
  }
  const users = await prisma.user.findMany({
    where: { id: { in: unique } },
    select: { id: true, name: true, email: true, image: true },
  });
  return new Map(users.map((u) => [u.id, u]));
}

function mapCommittee(doc: ProgramCommittee) {
  return {
    id: String(doc.id),
    programId: relId(doc.program),
    userId: doc.userId,
    role: doc.role,
    status: doc.status,
  };
}

function mapParticipant(doc: Participant) {
  return {
    id: String(doc.id),
    programId: relId(doc.program),
    userId: doc.userId,
    registrationDate: new Date(doc.registrationDate),
    registrationStatus: doc.registrationStatus,
  };
}

function mapAttendance(doc: Attendance) {
  return {
    id: String(doc.id),
    participantId: relId(doc.participant),
    checkIn: doc.checkIn ? new Date(doc.checkIn) : null,
    checkOut: doc.checkOut ? new Date(doc.checkOut) : null,
    status: doc.status,
  };
}

function mapDocumentation(doc: ProgramDocumentation) {
  return {
    id: String(doc.id),
    programId: relId(doc.program),
    mediaId:
      doc.media == null
        ? null
        : typeof doc.media === "number"
          ? String(doc.media)
          : String(doc.media.id),
    title: doc.title,
    description: doc.description ?? null,
  };
}

export const programRepository: ProgramRepository = {
  async findMany({ search, status, type, page, limit }) {
    const payload = await getPayloadClient();
    const and: Where[] = [{ deletedAt: { exists: false } }];
    if (search)
      and.push({
        or: [{ name: { like: search } }, { code: { like: search } }],
      });
    if (status) and.push({ status: { equals: status } });
    if (type) and.push({ type: { equals: type } });

    const res = await payload.find({
      collection: "programs",
      where: { and },
      sort: "-createdAt",
      page,
      limit,
      depth: 0,
    });

    return { items: res.docs.map(mapProgram), total: res.totalDocs };
  },

  async findById(id) {
    const n = Number(id);
    if (!Number.isInteger(n)) return null;
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "programs",
      where: { and: [{ id: { equals: n } }, { deletedAt: { exists: false } }] },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc ? mapProgram(doc) : null;
  },

  async findByCode(code) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "programs",
      where: { code: { equals: code } },
      limit: 1,
      depth: 0,
    });
    const doc = res.docs[0];
    return doc ? mapProgram(doc) : null;
  },

  async create(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "programs",
      data: programWriteData(data) as Program,
    });
    return mapProgram(doc);
  },

  async update(id, data) {
    const payload = await getPayloadClient();
    const doc = await payload.update({
      collection: "programs",
      id: Number(id),
      data: programWriteData(data) as Partial<Program>,
    });
    return mapProgram(doc);
  },

  async softDelete(id) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "programs",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async getSchedules(programId) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "program-schedules",
      where: {
        and: [
          { program: { equals: Number(programId) } },
          { deletedAt: { exists: false } },
        ],
      },
      sort: "startTime",
      depth: 0,
    });
    return res.docs.map(mapProgramSchedule);
  },

  async createSchedule(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "program-schedules",
      data: {
        program: Number(data.programId),
        title: data.title,
        venueId: data.venueId,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        description: data.description,
      },
    });
    return mapProgramSchedule(doc);
  },

  async updateSchedule(id, data) {
    const docData: ProgramWriteData & {
      program?: number;
      title?: string;
      venueId?: string | null;
      startTime?: string;
      endTime?: string;
      description?: string | null;
    } = {};
    if (data.programId !== undefined) docData.program = Number(data.programId);
    if (data.title !== undefined) docData.title = data.title;
    if (data.venueId !== undefined) docData.venueId = data.venueId;
    if (data.startTime !== undefined)
      docData.startTime = data.startTime.toISOString();
    if (data.endTime !== undefined)
      docData.endTime = data.endTime.toISOString();
    if (data.description !== undefined) docData.description = data.description;
    const payload = await getPayloadClient();
    const doc = await payload.update({
      collection: "program-schedules",
      id: Number(id),
      data: docData,
    });
    return mapProgramSchedule(doc);
  },

  async deleteSchedule(id) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "program-schedules",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async getCommittees(programId) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "program-committees",
      where: {
        and: [
          { program: { equals: Number(programId) } },
          { deletedAt: { exists: false } },
        ],
      },
      sort: "role",
      depth: 0,
    });
    const items = res.docs.map(mapCommittee);
    const users = await resolveProgramUsers(items.map((i) => i.userId));
    return items.map((item) => ({
      ...item,
      user: users.get(item.userId) ?? {
        id: item.userId,
        name: "",
        email: "",
        image: null,
      },
    })) as any;
  },

  async assignCommittee(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "program-committees",
      data: {
        program: Number(data.programId),
        userId: data.userId,
        role: data.role,
        status: data.status,
      },
    });
    return mapCommittee(doc) as ProgramCommitteeEntity;
  },

  async removeCommittee(id) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "program-committees",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async getParticipants(programId) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "participants",
      where: {
        and: [
          { program: { equals: Number(programId) } },
          { deletedAt: { exists: false } },
        ],
      },
      sort: "-registrationDate",
      depth: 0,
    });
    const items = res.docs.map(mapParticipant);
    const users = await resolveProgramUsers(items.map((i) => i.userId));
    return items.map((item) => ({
      ...item,
      user: users.get(item.userId) ?? {
        id: item.userId,
        name: "",
        email: "",
        image: null,
      },
    })) as any;
  },

  async registerParticipant(data) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "participants",
      data: {
        program: Number(data.programId),
        userId: data.userId,
        registrationDate: new Date().toISOString(),
        registrationStatus: data.registrationStatus,
      },
    });
    return mapParticipant(doc) as ParticipantEntity;
  },

  async updateParticipant(id, data) {
    const payload = await getPayloadClient();
    const doc = await payload.update({
      collection: "participants",
      id: Number(id),
      data:
        data.registrationStatus !== undefined
          ? { registrationStatus: data.registrationStatus }
          : {},
    });
    return mapParticipant(doc) as ParticipantEntity;
  },

  async removeParticipant(id) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "participants",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async getAttendance(programId) {
    const payload = await getPayloadClient();
    const partRes = await payload.find({
      collection: "participants",
      where: {
        and: [
          { program: { equals: Number(programId) } },
          { deletedAt: { exists: false } },
        ],
      },
      limit: 10000,
      depth: 0,
    });
    if (partRes.docs.length === 0) return [];
    const partIds = partRes.docs.map((d) => d.id);
    const users = await resolveProgramUsers(
      partRes.docs.map((d) => d.userId),
    );
    const userByParticipant = new Map(
      partRes.docs.map((d) => [d.id, d.userId]),
    );

    const attRes = await payload.find({
      collection: "attendances",
      where: { participant: { in: partIds } },
      sort: "-checkIn",
      limit: 10000,
      depth: 0,
    });

    return attRes.docs.map((doc) => {
      const pid = typeof doc.participant === "number" ? doc.participant : Number(doc.participant.id);
      const userId = userByParticipant.get(pid);
      const name = userId ? (users.get(userId)?.name ?? "") : "";
      return { ...mapAttendance(doc), participant: { user: { name } } };
    }) as any;
  },

  async checkIn(participantId) {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "attendances",
      data: {
        participant: Number(participantId),
        checkIn: new Date().toISOString(),
        status: "PRESENT",
      },
    });
    return mapAttendance(doc) as AttendanceEntity;
  },

  async checkOut(participantId) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "attendances",
      where: {
        and: [
          { participant: { equals: Number(participantId) } },
          { checkOut: { exists: false } },
        ],
      },
      sort: "-checkIn",
      limit: 1,
      depth: 0,
    });
    const existing = res.docs[0];
    if (!existing) throw new Error("Belum check in atau sudah check out.");
    const doc = await payload.update({
      collection: "attendances",
      id: Number(existing.id),
      data: { checkOut: new Date().toISOString() },
    });
    return mapAttendance(doc) as AttendanceEntity;
  },

  async getDocumentation(programId) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "program-documentations",
      where: {
        and: [
          { program: { equals: Number(programId) } },
          { deletedAt: { exists: false } },
        ],
      },
      sort: "title",
      depth: 0,
    });
    return res.docs.map(mapDocumentation);
  },

  async addDocumentation(data) {
    const payload = await getPayloadClient();
    const mediaNum = Number(data.mediaId);
    const doc = await payload.create({
      collection: "program-documentations",
      data: {
        program: Number(data.programId),
        media:
          data.mediaId && Number.isInteger(mediaNum) ? mediaNum : null,
        title: data.title,
        description: data.description,
      },
    });
    return mapDocumentation(doc) as ProgramDocumentationEntity;
  },

  async removeDocumentation(id) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "program-documentations",
      id: Number(id),
      data: { deletedAt: new Date().toISOString() },
    });
  },

  async getDashboardStats() {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "programs",
      where: { deletedAt: { exists: false } },
      limit: 10000,
      depth: 0,
    });
    const docs = res.docs;
    const count = (s: Program["status"]) =>
      docs.filter((d) => d.status === s).length;
    return {
      total: docs.length,
      draft: count("DRAFT"),
      published: count("PUBLISHED"),
      registrationOpen: count("REGISTRATION_OPEN"),
      onGoing: count("ON_GOING"),
      completed: count("COMPLETED"),
    };
  },

  async getUpcomingPrograms(limit) {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "programs",
      where: {
        and: [
          { deletedAt: { exists: false } },
          { status: { in: ["PUBLISHED", "REGISTRATION_OPEN"] } },
          { startDate: { greater_than_equal: new Date().toISOString() } },
        ],
      },
      sort: "startDate",
      limit,
      depth: 0,
    });
    return res.docs.map(mapProgram);
  },
};
