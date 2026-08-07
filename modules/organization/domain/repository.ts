import type {
  OfficerEntity,
  OrganizationUnitEntity,
} from "./entities";

export interface OrganizationRepository {
  findAllUnits(): Promise<OrganizationUnitEntity[]>;
  findUnitById(id: string): Promise<OrganizationUnitEntity | null>;
  findUnitByCode(code: string): Promise<OrganizationUnitEntity | null>;
  createUnit(
    data: Omit<
      OrganizationUnitEntity,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ): Promise<OrganizationUnitEntity>;
  updateUnit(
    id: string,
    data: Partial<
      Omit<
        OrganizationUnitEntity,
        "id" | "createdAt" | "updatedAt" | "deletedAt"
      >
    >,
  ): Promise<OrganizationUnitEntity>;
  softDeleteUnit(id: string): Promise<void>;
  countUnits(): Promise<number>;

  findOfficersByUnit(unitId: string): Promise<OfficerEntity[]>;
  findOfficerById(id: string): Promise<OfficerEntity | null>;
  createOfficer(
    data: Omit<OfficerEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<OfficerEntity>;
  updateOfficer(
    id: string,
    data: Partial<
      Omit<OfficerEntity, "id" | "createdAt" | "updatedAt" | "deletedAt">
    >,
  ): Promise<OfficerEntity>;
  softDeleteOfficer(id: string): Promise<void>;
  countOfficers(): Promise<number>;
  countOfficersByUnit(): Promise<{ unitId: string; count: number }[]>;
}
