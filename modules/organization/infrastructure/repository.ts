import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { UnitLevel } from "@/generated/client";
import type { Officer, Unit } from "@/payload-types";
import type {
  OfficerEntity,
  OrganizationUnitEntity,
} from "../domain/entities";
import type { OrganizationRepository } from "../domain/repository";

function toNum(id: string): number {
  const n = Number(id);
  if (!Number.isInteger(n)) {
    throw new Error(`ID tidak valid: ${id}`);
  }
  return n;
}

function relId(
  value: number | { id: number } | null | undefined,
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return String(value.id);
  return String(value);
}

function mapUnit(doc: Unit): OrganizationUnitEntity {
  return {
    id: String(doc.id),
    code: doc.code,
    name: doc.name,
    level: doc.level as UnitLevel,
    parentId: relId(doc.parent),
    sortOrder: doc.sortOrder ?? 0,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

function mapOfficer(doc: Officer): OfficerEntity {
  return {
    id: String(doc.id),
    unitId: relId(doc.unit) ?? "",
    name: doc.name,
    position: doc.position,
    isLeader: doc.isLeader ?? false,
    phone: doc.phone ?? null,
    email: doc.email ?? null,
    sortOrder: doc.sortOrder ?? 0,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt) : null,
  };
}

function isActiveUnit(doc: Unit): boolean {
  return !doc.deletedAt;
}

async function findAllUnits(): Promise<OrganizationUnitEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "units",
    limit: 1000,
    depth: 0,
  });
  return res.docs
    .filter(isActiveUnit)
    .map(mapUnit)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code),
    );
}

async function findUnitById(
  id: string,
): Promise<OrganizationUnitEntity | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "units",
    where: { id: { equals: toNum(id) } },
    limit: 1,
    depth: 0,
  });
  const doc = res.docs[0];
  return doc && isActiveUnit(doc) ? mapUnit(doc) : null;
}

async function findUnitByCode(
  code: string,
): Promise<OrganizationUnitEntity | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "units",
    where: { code: { equals: code } },
    limit: 1,
    depth: 0,
  });
  const doc = res.docs[0];
  return doc && isActiveUnit(doc) ? mapUnit(doc) : null;
}

async function createUnit(
  data: Omit<
    OrganizationUnitEntity,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  >,
): Promise<OrganizationUnitEntity> {
  const payload = await getPayloadClient();
  const doc = await payload.create({
    collection: "units",
    data: {
      code: data.code,
      name: data.name,
      level: data.level,
      parent: data.parentId ? toNum(data.parentId) : null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return mapUnit(doc);
}

async function updateUnit(
  id: string,
  data: Partial<
    Omit<
      OrganizationUnitEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >
  >,
): Promise<OrganizationUnitEntity> {
  const payload = await getPayloadClient();
  const payloadData: Partial<Unit> = {};
  if (data.code !== undefined) payloadData.code = data.code;
  if (data.name !== undefined) payloadData.name = data.name;
  if (data.level !== undefined) payloadData.level = data.level;
  if (data.parentId !== undefined) {
    payloadData.parent =
      data.parentId === null || data.parentId === ""
        ? null
        : toNum(data.parentId);
  }
  if (data.sortOrder !== undefined) payloadData.sortOrder = data.sortOrder;
  const doc = await payload.update({
    collection: "units",
    id: toNum(id),
    data: payloadData,
  });
  return mapUnit(doc);
}

async function softDeleteUnit(id: string): Promise<void> {
  const payload = await getPayloadClient();
  await payload.update({
    collection: "units",
    id: toNum(id),
    data: { deletedAt: new Date().toISOString() },
  });
}

async function countUnits(): Promise<number> {
  return (await findAllUnits()).length;
}

async function findOfficersByUnit(unitId: string): Promise<OfficerEntity[]> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "officers",
    where: { unit: { equals: toNum(unitId) } },
    limit: 1000,
    depth: 0,
  });
  return res.docs
    .filter((doc) => !doc.deletedAt)
    .map(mapOfficer)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
    );
}

async function findOfficerById(id: string): Promise<OfficerEntity | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "officers",
    where: { id: { equals: toNum(id) } },
    limit: 1,
    depth: 0,
  });
  const doc = res.docs[0];
  return doc && !doc.deletedAt ? mapOfficer(doc) : null;
}

async function findOfficersByUnitCodes(
  codes: string[],
): Promise<{ officer: OfficerEntity; unitCode: string }[]> {
  if (codes.length === 0) return [];
  const payload = await getPayloadClient();
  const unitsRes = await payload.find({
    collection: "units",
    where: { code: { in: codes } },
    limit: 1000,
    depth: 0,
  });
  const units = unitsRes.docs.filter(isActiveUnit);
  const idToCode = new Map(units.map((u) => [String(u.id), u.code]));
  if (idToCode.size === 0) return [];

  const officersRes = await payload.find({
    collection: "officers",
    where: { unit: { in: units.map((u) => u.id) } },
    limit: 1000,
    depth: 0,
  });
  const results: { officer: OfficerEntity; unitCode: string }[] = [];
  for (const doc of officersRes.docs) {
    if (doc.deletedAt) continue;
    const unitCode = relId(doc.unit);
    const code = unitCode ? idToCode.get(unitCode) : undefined;
    if (code) results.push({ officer: mapOfficer(doc), unitCode: code });
  }
  return results;
}

async function createOfficer(
  data: Omit<OfficerEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">,
): Promise<OfficerEntity> {
  const payload = await getPayloadClient();
  const doc = await payload.create({
    collection: "officers",
    data: {
      unit: toNum(data.unitId),
      name: data.name,
      position: data.position,
      isLeader: data.isLeader ?? false,
      phone: data.phone ?? undefined,
      email: data.email ?? undefined,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return mapOfficer(doc);
}

async function updateOfficer(
  id: string,
  data: Partial<
    Omit<OfficerEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >,
): Promise<OfficerEntity> {
  const payload = await getPayloadClient();
  const payloadData: Partial<Officer> = {};
  if (data.unitId !== undefined && data.unitId !== "") {
    payloadData.unit = toNum(data.unitId);
  }
  if (data.name !== undefined) payloadData.name = data.name;
  if (data.position !== undefined) payloadData.position = data.position;
  if (data.isLeader !== undefined) payloadData.isLeader = data.isLeader;
  if (data.phone !== undefined) payloadData.phone = data.phone;
  if (data.email !== undefined) payloadData.email = data.email;
  if (data.sortOrder !== undefined) payloadData.sortOrder = data.sortOrder;
  const doc = await payload.update({
    collection: "officers",
    id: toNum(id),
    data: payloadData,
  });
  return mapOfficer(doc);
}

async function softDeleteOfficer(id: string): Promise<void> {
  const payload = await getPayloadClient();
  await payload.update({
    collection: "officers",
    id: toNum(id),
    data: { deletedAt: new Date().toISOString() },
  });
}

async function countOfficers(): Promise<number> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "officers",
    limit: 1000,
    depth: 0,
  });
  return res.docs.filter((doc) => !doc.deletedAt).length;
}

async function countOfficersByUnit(): Promise<
  { unitId: string; count: number }[]
> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "officers",
    limit: 1000,
    depth: 0,
  });
  const counts = new Map<string, number>();
  for (const doc of res.docs) {
    if (doc.deletedAt) continue;
    const unitId = relId(doc.unit);
    if (!unitId) continue;
    counts.set(unitId, (counts.get(unitId) ?? 0) + 1);
  }
  return Array.from(counts, ([unitId, count]) => ({ unitId, count }));
}

export const payloadOrganizationRepository: OrganizationRepository = {
  findAllUnits,
  findUnitById,
  findUnitByCode,
  createUnit,
  updateUnit,
  softDeleteUnit,
  countUnits,
  findOfficersByUnit,
  findOfficerById,
  findOfficersByUnitCodes,
  createOfficer,
  updateOfficer,
  softDeleteOfficer,
  countOfficers,
  countOfficersByUnit,
};

export const organizationRepository: OrganizationRepository =
  payloadOrganizationRepository;