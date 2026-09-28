import type { ProgramStatus } from "@/generated/client";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import { prisma } from "@/modules/shared/infrastructure/prisma";
import { programRepository } from "../infrastructure/repository";

async function withPersonInCharge<
  T extends { personInChargeId: string | null },
>(items: T[]) {
  const ids = [
    ...new Set(
      items
        .map((i) => i.personInChargeId)
        .filter((x): x is string => x != null),
    ),
  ];
  const users =
    ids.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: ids } },
          select: { id: true, name: true },
        })
      : [];
  const map = new Map(users.map((u) => [u.id, u]));
  return items.map((item) => ({
    ...item,
    personInCharge: item.personInChargeId
      ? (map.get(item.personInChargeId) ?? null)
      : null,
  }));
}

export async function getPrograms(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const payload = await getPayloadClient();
  const and: NonNullable<
    import("payload").Where
  >[] = [{ deletedAt: { exists: false } }];
  if (params.search)
    and.push({
      or: [
        { name: { like: params.search } },
        { code: { like: params.search } },
      ],
    });
  if (params.status)
    and.push({ status: { equals: params.status as ProgramStatus } });

  const res = await payload.find({
    collection: "programs",
    where: { and },
    sort: "-createdAt",
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    depth: 0,
  });

  const items = await withPersonInCharge(res.docs.map((d) => ({
    id: String(d.id),
    code: d.code,
    name: d.name,
    type: d.type,
    description: d.description ?? null,
    organizerId: d.organizerId ?? null,
    personInChargeId: d.personInChargeId ?? null,
    status: d.status,
    registrationOpen: d.registrationOpen
      ? new Date(d.registrationOpen)
      : null,
    registrationClose: d.registrationClose
      ? new Date(d.registrationClose)
      : null,
    startDate: new Date(d.startDate),
    endDate: new Date(d.endDate),
    createdAt: new Date(d.createdAt),
    updatedAt: new Date(d.updatedAt),
    deletedAt: d.deletedAt ? new Date(d.deletedAt) : null,
  })));

  return { items, total: res.totalDocs };
}

export async function getProgramById(id: string) {
  const item = await programRepository.findById(id);
  if (!item) return null;
  const [enriched] = await withPersonInCharge([item]);
  return enriched as unknown as any;
}

export async function getProgramStats() {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "programs",
    where: { deletedAt: { exists: false } },
    limit: 10000,
    depth: 0,
  });
  const docs = res.docs;
  const count = (s: ProgramStatus) =>
    docs.filter((d) => d.status === s).length;

  return {
    total: docs.length,
    draft: count("DRAFT"),
    published: count("PUBLISHED"),
    registrationOpen: count("REGISTRATION_OPEN"),
    registrationClosed: count("REGISTRATION_CLOSED"),
    onGoing: count("ON_GOING"),
    completed: count("COMPLETED"),
    cancelled: count("CANCELLED"),
    archived: count("ARCHIVED"),
  };
}

export async function getSchedules(programId: string) {
  return programRepository.getSchedules(programId) as unknown as any[];
}

export async function getCommittees(programId: string) {
  return programRepository.getCommittees(programId) as unknown as any[];
}

export async function getParticipants(programId: string) {
  return programRepository.getParticipants(programId) as unknown as any[];
}

export async function getAttendance(programId: string) {
  return programRepository.getAttendance(programId) as unknown as any[];
}

export async function getDocumentation(programId: string) {
  return programRepository.getDocumentation(programId) as unknown as any[];
}

export async function getUpcomingPrograms(limit = 5) {
  return programRepository.getUpcomingPrograms(limit);
}

export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  }) as unknown as any[];
}

export async function getMediaItems() {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "program-documentations",
    where: { deletedAt: { exists: false } },
    limit: 10000,
    depth: 0,
  });
  return res.docs.map((d) => ({
    id: String(d.id),
    mediaId:
      d.media == null
        ? null
        : typeof d.media === "number"
          ? String(d.media)
          : String(d.media.id),
    title: d.title,
  })) as unknown as any[];
}
