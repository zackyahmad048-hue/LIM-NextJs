import { Prisma } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  ProgramEntity,
  ProgramScheduleEntity,
  ProgramCommitteeEntity,
  ParticipantEntity,
  AttendanceEntity,
  ProgramDocumentationEntity,
} from "../domain/entities";
import type { ProgramRepository } from "../domain/repository";

const includeUser = {
  select: { id: true, name: true, email: true, image: true },
};

export const programRepository: ProgramRepository = {
  async findMany({ search, status, type, page, limit }) {
    const where: Prisma.ProgramWhereInput = { deletedAt: null };
    if (search)
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ];
    if (status) where.status = status;
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.program.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.program.count({ where }),
    ]);

    return { items: items as unknown as ProgramEntity[], total };
  },

  async findById(id) {
    const item = await prisma.program.findFirst({
      where: { id, deletedAt: null },
    });
    return item as ProgramEntity | null;
  },

  async findByCode(code) {
    const item = await prisma.program.findUnique({ where: { code } });
    return item as ProgramEntity | null;
  },

  async create(data) {
    const item = await prisma.program.create({ data: data as any });
    return item as ProgramEntity;
  },

  async update(id, data) {
    const item = await prisma.program.update({
      where: { id },
      data: data as any,
    });
    return item as ProgramEntity;
  },

  async softDelete(id) {
    await prisma.program.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getSchedules(programId) {
    const items = await prisma.programSchedule.findMany({
      where: { programId, deletedAt: null },
      orderBy: { startTime: "asc" },
    });
    return items as unknown as ProgramScheduleEntity[];
  },

  async createSchedule(data) {
    const item = await prisma.programSchedule.create({ data: data as any });
    return item as unknown as ProgramScheduleEntity;
  },

  async updateSchedule(id, data) {
    const item = await prisma.programSchedule.update({
      where: { id },
      data: data as any,
    });
    return item as unknown as ProgramScheduleEntity;
  },

  async deleteSchedule(id) {
    await prisma.programSchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getCommittees(programId) {
    const items = await prisma.programCommittee.findMany({
      where: { programId, deletedAt: null },
      include: { user: includeUser },
      orderBy: { role: "asc" },
    });
    return items as any;
  },

  async assignCommittee(data) {
    const item = await prisma.programCommittee.create({ data: data as any });
    return item as unknown as ProgramCommitteeEntity;
  },

  async removeCommittee(id) {
    await prisma.programCommittee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getParticipants(programId) {
    const items = await prisma.participant.findMany({
      where: { programId, deletedAt: null },
      include: { user: includeUser },
      orderBy: { registrationDate: "desc" },
    });
    return items as any;
  },

  async registerParticipant(data) {
    const item = await prisma.participant.create({ data: data as any });
    return item as unknown as ParticipantEntity;
  },

  async updateParticipant(id, data) {
    const item = await prisma.participant.update({
      where: { id },
      data: data as any,
    });
    return item as unknown as ParticipantEntity;
  },

  async removeParticipant(id) {
    await prisma.participant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getAttendance(programId) {
    const items = await prisma.attendance.findMany({
      where: { participant: { programId } },
      include: {
        participant: { include: { user: { select: { name: true } } } },
      },
      orderBy: { checkIn: "desc" },
    });
    return items as any;
  },

  async checkIn(participantId) {
    const item = await prisma.attendance.create({
      data: { participantId, checkIn: new Date(), status: "PRESENT" },
    });
    return item as unknown as AttendanceEntity;
  },

  async checkOut(participantId) {
    const existing = await prisma.attendance.findFirst({
      where: { participantId, checkOut: null },
    });
    if (!existing) throw new Error("Belum check in atau sudah check out.");
    const item = await prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: new Date() },
    });
    return item as unknown as AttendanceEntity;
  },

  async getDocumentation(programId) {
    const items = await prisma.programDocumentation.findMany({
      where: { programId, deletedAt: null },
      orderBy: { title: "asc" },
    });
    return items as unknown as ProgramDocumentationEntity[];
  },

  async addDocumentation(data) {
    const item = await prisma.programDocumentation.create({
      data: data as any,
    });
    return item as unknown as ProgramDocumentationEntity;
  },

  async removeDocumentation(id) {
    await prisma.programDocumentation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async getDashboardStats() {
    const [total, draft, published, registrationOpen, onGoing, completed] =
      await Promise.all([
        prisma.program.count({ where: { deletedAt: null } }),
        prisma.program.count({ where: { status: "DRAFT", deletedAt: null } }),
        prisma.program.count({
          where: { status: "PUBLISHED", deletedAt: null },
        }),
        prisma.program.count({
          where: { status: "REGISTRATION_OPEN", deletedAt: null },
        }),
        prisma.program.count({
          where: { status: "ON_GOING", deletedAt: null },
        }),
        prisma.program.count({
          where: { status: "COMPLETED", deletedAt: null },
        }),
      ]);

    return { total, draft, published, registrationOpen, onGoing, completed };
  },

  async getUpcomingPrograms(limit) {
    const items = await prisma.program.findMany({
      where: {
        deletedAt: null,
        status: { in: ["PUBLISHED", "REGISTRATION_OPEN"] },
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: limit,
    });
    return items as unknown as ProgramEntity[];
  },
};
