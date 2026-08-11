import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  OfficerEntity,
  OrganizationUnitEntity,
} from "../domain/entities";
import type { OrganizationRepository } from "../domain/repository";

export const prismaOrganizationRepository: OrganizationRepository = {
  async findAllUnits() {
    const items = await prisma.organizationUnit.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    });
    return items as unknown as OrganizationUnitEntity[];
  },

  async findUnitById(id) {
    const item = await prisma.organizationUnit.findFirst({
      where: { id, deletedAt: null },
    });
    return item as OrganizationUnitEntity | null;
  },

  async findUnitByCode(code) {
    const item = await prisma.organizationUnit.findUnique({
      where: { code },
    });
    return item as OrganizationUnitEntity | null;
  },

  async createUnit(data) {
    const item = await prisma.organizationUnit.create({ data: data as any });
    return item as OrganizationUnitEntity;
  },

  async updateUnit(id, data) {
    const item = await prisma.organizationUnit.update({
      where: { id },
      data: data as any,
    });
    return item as OrganizationUnitEntity;
  },

  async softDeleteUnit(id) {
    await prisma.organizationUnit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async countUnits() {
    return prisma.organizationUnit.count({ where: { deletedAt: null } });
  },

  async findOfficersByUnit(unitId) {
    const items = await prisma.officer.findMany({
      where: { unitId, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return items as unknown as OfficerEntity[];
  },

  async findOfficersByUnitCodes(codes) {
    const items = await prisma.officer.findMany({
      where: { deletedAt: null, unit: { code: { in: codes } } },
      select: {
        unit: { select: { code: true } },
        id: true,
        unitId: true,
        name: true,
        position: true,
        isLeader: true,
        phone: true,
        email: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return items.map((item) => ({
      officer: item as unknown as OfficerEntity,
      unitCode: item.unit.code,
    }));
  },

  async findOfficerById(id) {
    const item = await prisma.officer.findFirst({
      where: { id, deletedAt: null },
    });
    return item as OfficerEntity | null;
  },

  async createOfficer(data) {
    const item = await prisma.officer.create({ data: data as any });
    return item as OfficerEntity;
  },

  async updateOfficer(id, data) {
    const item = await prisma.officer.update({
      where: { id },
      data: data as any,
    });
    return item as OfficerEntity;
  },

  async softDeleteOfficer(id) {
    await prisma.officer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  async countOfficers() {
    return prisma.officer.count({ where: { deletedAt: null } });
  },

  async countOfficersByUnit() {
    const rows = await prisma.officer.groupBy({
      by: ["unitId"],
      where: { deletedAt: null },
      _count: { _all: true },
    });
    return rows.map((row) => ({
      unitId: row.unitId,
      count: row._count._all,
    }));
  },
};

export const organizationRepository: OrganizationRepository =
  prismaOrganizationRepository;
