import { Prisma } from "@/generated/client";
import type { ProgramStatus } from "@/generated/client";
import { prisma } from "@/modules/shared/infrastructure/prisma";

export async function getPrograms(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.ProgramWhereInput = { deletedAt: null };
  if (params.search)
    where.OR = [
      { name: { contains: params.search } },
      { code: { contains: params.search } },
    ];
  if (params.status)
    where.status = params.status as ProgramStatus;

  const [items, total] = await Promise.all([
    prisma.program.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 20),
      take: params.limit ?? 20,
      include: { personInCharge: { select: { id: true, name: true } } },
    }),
    prisma.program.count({ where }),
  ]);

  return { items, total };
}

export async function getProgramById(id: string) {
  return prisma.program.findFirst({
    where: { id, deletedAt: null },
    include: { personInCharge: { select: { id: true, name: true } } },
  }) as unknown as any;
}

export async function getProgramStats() {
  const [
    total,
    draft,
    published,
    registrationOpen,
    registrationClosed,
    onGoing,
    completed,
    cancelled,
    archived,
  ] = await Promise.all([
    prisma.program.count({ where: { deletedAt: null } }),
    prisma.program.count({ where: { status: "DRAFT", deletedAt: null } }),
    prisma.program.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.program.count({
      where: { status: "REGISTRATION_OPEN", deletedAt: null },
    }),
    prisma.program.count({
      where: { status: "REGISTRATION_CLOSED", deletedAt: null },
    }),
    prisma.program.count({ where: { status: "ON_GOING", deletedAt: null } }),
    prisma.program.count({ where: { status: "COMPLETED", deletedAt: null } }),
    prisma.program.count({ where: { status: "CANCELLED", deletedAt: null } }),
    prisma.program.count({ where: { status: "ARCHIVED", deletedAt: null } }),
  ]);

  return {
    total,
    draft,
    published,
    registrationOpen,
    registrationClosed,
    onGoing,
    completed,
    cancelled,
    archived,
  };
}

export async function getSchedules(programId: string) {
  return prisma.programSchedule.findMany({
    where: { programId, deletedAt: null },
    orderBy: { startTime: "asc" },
  }) as unknown as any[];
}

export async function getCommittees(programId: string) {
  return prisma.programCommittee.findMany({
    where: { programId, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { role: "asc" },
  }) as unknown as any[];
}

export async function getParticipants(programId: string) {
  return prisma.participant.findMany({
    where: { programId, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { registrationDate: "desc" },
  }) as unknown as any[];
}

export async function getAttendance(programId: string) {
  return prisma.attendance.findMany({
    where: { participant: { programId } },
    include: { participant: { include: { user: { select: { name: true } } } } },
    orderBy: { checkIn: "desc" },
  }) as unknown as any[];
}

export async function getDocumentation(programId: string) {
  return prisma.programDocumentation.findMany({
    where: { programId, deletedAt: null },
    orderBy: { title: "asc" },
  }) as unknown as any[];
}

export async function getUpcomingPrograms(limit = 5) {
  return prisma.program.findMany({
    where: {
      deletedAt: null,
      status: { in: ["PUBLISHED", "REGISTRATION_OPEN"] },
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  }) as unknown as any[];
}

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  }) as unknown as any[];
}

export async function getMediaItems() {
  return prisma.programDocumentation.findMany({
    where: { deletedAt: null },
    select: { id: true, mediaId: true, title: true },
  }) as unknown as any[];
}
