import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  image: string;
  sortOrder: number;
}

export interface RegionalBoard {
  id: string;
  province: string;
  name: string;
  members: BoardMember[];
}

export interface BranchBoard {
  id: string;
  province: string;
  regency: string;
  name: string;
  members: BoardMember[];
}

export interface OrgStructure {
  organization: {
    name: string;
    shortName: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  googleSheetUrl: string;
  centralBoard: BoardMember[];
  regionalBoards: RegionalBoard[];
  branchBoards: BranchBoard[];
  members: BoardMember[];
}

const STRUCTURE_KEY = "org:structure";

const defaultStructure: OrgStructure = {
  organization: {
    name: "Lembaga Ittihadul Muballighin",
    shortName: "LIM",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  },
  googleSheetUrl: "",
  centralBoard: [],
  regionalBoards: [],
  branchBoards: [],
  members: [],
};

export async function getStructure(): Promise<OrgStructure> {
  const setting = await prisma.setting.findUnique({
    where: { key: STRUCTURE_KEY },
  });

  if (!setting) return defaultStructure;

  try {
    const parsed = JSON.parse(setting.value);
    return {
      ...defaultStructure,
      ...parsed,
      organization: {
        ...defaultStructure.organization,
        ...parsed.organization,
      },
      centralBoard: parsed.centralBoard ?? defaultStructure.centralBoard,
      regionalBoards:
        parsed.regionalBoards ?? defaultStructure.regionalBoards,
      branchBoards: parsed.branchBoards ?? defaultStructure.branchBoards,
      members: parsed.members ?? defaultStructure.members,
    };
  } catch {
    return defaultStructure;
  }
}

export async function saveStructure(data: OrgStructure) {
  return prisma.setting.upsert({
    where: { key: STRUCTURE_KEY },
    create: {
      key: STRUCTURE_KEY,
      value: JSON.stringify(data),
      type: "JSON",
    },
    update: {
      value: JSON.stringify(data),
      type: "JSON",
    },
  });
}