import type { UnitLevel } from "@/generated/client";

export interface OrganizationUnitEntity {
  id: string;
  code: string;
  name: string;
  level: UnitLevel;
  parentId: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OfficerEntity {
  id: string;
  unitId: string;
  name: string;
  position: string;
  isLeader: boolean;
  phone: string | null;
  email: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface OrganizationUnitTreeNode extends OrganizationUnitEntity {
  children: OrganizationUnitTreeNode[];
}

export const UNIT_LEVEL_LABELS: Record<UnitLevel, string> = {
  PP: "Pengurus Pusat",
  PW: "Pengurus Wilayah",
  PC: "Pengurus Cabang",
};

export const UNIT_LEVEL_ORDERS: Record<UnitLevel, number> = {
  PP: 0,
  PW: 1,
  PC: 2,
};

export function isParentLevelValid(
  level: UnitLevel,
  parentLevel: UnitLevel | null,
): boolean {
  if (level === "PP") return parentLevel === null;
  if (level === "PW") return parentLevel === "PP";
  return parentLevel === "PW" || parentLevel === null;
}
