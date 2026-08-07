import {
  isParentLevelValid,
  type OfficerEntity,
  type OrganizationUnitEntity,
  type OrganizationUnitTreeNode,
  UNIT_LEVEL_ORDERS,
} from "../domain/entities";
import {
  DuplicateUnitCodeError,
  InvalidParentUnitError,
  OfficerNotFoundError,
  UnitHasChildrenError,
  UnitNotFoundError,
} from "../domain/organization.errors";
import { organizationRepository as repo } from "../infrastructure/repository";

function buildTree(
  units: OrganizationUnitEntity[],
  parentId: string | null = null,
): OrganizationUnitTreeNode[] {
  return units
    .filter((unit) => unit.parentId === parentId)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        UNIT_LEVEL_ORDERS[a.level] - UNIT_LEVEL_ORDERS[b.level] ||
        a.code.localeCompare(b.code),
    )
    .map((unit) => ({
      ...unit,
      children: buildTree(units, unit.id),
    }));
}

export interface UnitCreateInput {
  code: string;
  name: string;
  level: "PP" | "PW" | "PC";
  parentId?: string;
  sortOrder?: number;
}

export interface OfficerCreateInput {
  unitId: string;
  name: string;
  position: string;
  isLeader?: boolean;
  phone?: string;
  email?: string;
  sortOrder?: number;
}

export const organizationService = {
  async getUnitTree(): Promise<OrganizationUnitTreeNode[]> {
    const units = await repo.findAllUnits();
    return buildTree(units);
  },

  async listUnits(): Promise<OrganizationUnitEntity[]> {
    return repo.findAllUnits();
  },

  async getUnitById(id: string): Promise<OrganizationUnitEntity> {
    const unit = await repo.findUnitById(id);
    if (!unit) throw new UnitNotFoundError(id);
    return unit;
  },

  async createUnit(input: UnitCreateInput): Promise<OrganizationUnitEntity> {
    const existing = await repo.findUnitByCode(input.code.trim());
    if (existing) throw new DuplicateUnitCodeError(input.code);

    let parent: OrganizationUnitEntity | null = null;
    if (input.parentId) {
      parent = await repo.findUnitById(input.parentId);
      if (!parent) throw new UnitNotFoundError(input.parentId);
    }

    if (!isParentLevelValid(input.level, parent?.level ?? null)) {
      throw new InvalidParentUnitError(
        parent
          ? `Unit ${input.level} tidak dapat menjadi bawahan unit ${parent.level}.`
          : `Unit ${input.level} membutuhkan unit induk.`,
      );
    }

    return repo.createUnit({
      code: input.code.trim(),
      name: input.name.trim(),
      level: input.level,
      parentId: parent?.id ?? null,
      sortOrder: input.sortOrder ?? 0,
    });
  },

  async updateUnit(
    id: string,
    input: Partial<UnitCreateInput>,
  ): Promise<OrganizationUnitEntity> {
    const unit = await repo.findUnitById(id);
    if (!unit) throw new UnitNotFoundError(id);

    const data: Partial<Omit<OrganizationUnitEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">> = {};

    if (input.code !== undefined && input.code.trim() !== unit.code) {
      const existing = await repo.findUnitByCode(input.code.trim());
      if (existing) throw new DuplicateUnitCodeError(input.code);
      data.code = input.code.trim();
    }
    if (input.name !== undefined) data.name = input.name.trim();
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    if (input.level !== undefined || input.parentId !== undefined) {
      const nextLevel = input.level ?? unit.level;
      const nextParentId: string | null =
        input.parentId === undefined ? unit.parentId : input.parentId || null;

      if (nextParentId === id) {
        throw new InvalidParentUnitError("Unit tidak dapat menjadi induknya sendiri.");
      }

      if (nextParentId !== unit.parentId || nextLevel !== unit.level) {
        const parent = nextParentId
          ? await repo.findUnitById(nextParentId)
          : null;
        if (nextParentId && !parent) {
          throw new UnitNotFoundError(nextParentId);
        }
        if (!isParentLevelValid(nextLevel, parent?.level ?? null)) {
          throw new InvalidParentUnitError(
            parent
              ? `Unit ${nextLevel} tidak dapat menjadi bawahan unit ${parent.level}.`
              : `Unit ${nextLevel} membutuhkan unit induk.`,
          );
        }
      }

      if (nextParentId !== unit.parentId) {
        data.parentId = nextParentId;
      }
      if (nextLevel !== unit.level) {
        data.level = nextLevel;
      }
    }

    return repo.updateUnit(id, data);
  },

  async deleteUnit(id: string): Promise<void> {
    const unit = await repo.findUnitById(id);
    if (!unit) throw new UnitNotFoundError(id);

    const tree = await buildTree(await repo.findAllUnits());
    const hasChildren = tree.some((node) => node.id === id && node.children.length > 0);
    if (hasChildren) throw new UnitHasChildrenError();

    await repo.softDeleteUnit(id);
  },

  async listOfficers(unitId: string): Promise<OfficerEntity[]> {
    return repo.findOfficersByUnit(unitId);
  },

  async getOfficerById(id: string): Promise<OfficerEntity> {
    const officer = await repo.findOfficerById(id);
    if (!officer) throw new OfficerNotFoundError(id);
    return officer;
  },

  async createOfficer(input: OfficerCreateInput): Promise<OfficerEntity> {
    const unit = await repo.findUnitById(input.unitId);
    if (!unit) throw new UnitNotFoundError(input.unitId);

    const officers = await repo.findOfficersByUnit(input.unitId);
    const nextOrder =
      officers.length === 0
        ? 0
        : Math.max(...officers.map((officer) => officer.sortOrder)) + 1;

    if (input.isLeader) {
      for (const officer of officers) {
        if (officer.isLeader) {
          await repo.updateOfficer(officer.id, { isLeader: false });
        }
      }
    }

    return repo.createOfficer({
      unitId: input.unitId,
      name: input.name.trim(),
      position: input.position.trim(),
      isLeader: input.isLeader ?? false,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      sortOrder: input.sortOrder ?? nextOrder,
    });
  },

  async updateOfficer(
    id: string,
    input: Partial<Omit<OfficerCreateInput, "unitId">>,
  ): Promise<OfficerEntity> {
    const officer = await repo.findOfficerById(id);
    if (!officer) throw new OfficerNotFoundError(id);

    const data: Partial<Omit<OfficerEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">> = {};
    if (input.name !== undefined) data.name = input.name.trim();
    if (input.position !== undefined) data.position = input.position.trim();
    if (input.phone !== undefined) data.phone = input.phone.trim() || null;
    if (input.email !== undefined) data.email = input.email.trim() || null;
    if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

    const isLeaderChanged =
      input.isLeader === true && officer.isLeader === false;
    if (isLeaderChanged) {
      const officers = await repo.findOfficersByUnit(officer.unitId);
      for (const other of officers) {
        if (other.id !== officer.id && other.isLeader) {
          await repo.updateOfficer(other.id, { isLeader: false });
        }
      }
      data.isLeader = true;
    } else if (input.isLeader === false && officer.isLeader) {
      data.isLeader = false;
    }

    return repo.updateOfficer(id, data);
  },

  async deleteOfficer(id: string): Promise<void> {
    const officer = await repo.findOfficerById(id);
    if (!officer) throw new OfficerNotFoundError(id);
    await repo.softDeleteOfficer(id);
  },

  async getOrganizationStats() {
    const [units, totalOfficers, totalUnits, officerCounts] =
      await Promise.all([
        repo.findAllUnits(),
        repo.countOfficers(),
        repo.countUnits(),
        repo.countOfficersByUnit(),
      ]);

    const officerCountByUnit = Object.fromEntries(
      officerCounts.map((row) => [row.unitId, row.count]),
    );

    return {
      totalUnits,
      totalOfficers,
      unitCount: {
        PP: units.filter((unit) => unit.level === "PP").length,
        PW: units.filter((unit) => unit.level === "PW").length,
        PC: units.filter((unit) => unit.level === "PC").length,
      },
      officerCountByUnit: officerCountByUnit as Record<string, number>,
    };
  },
};
