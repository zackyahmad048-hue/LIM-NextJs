import { prisma } from "@/modules/shared/infrastructure/prisma";

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
  departments: {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
  }[];
  positions: {
    id: string;
    departmentId: string;
    name: string;
    level: number;
    sortOrder: number;
  }[];
  management: {
    id: string;
    name: string;
    positionId: string;
    description: string;
    image: string;
  }[];
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
  departments: [],
  positions: [],
  management: [],
};

export async function getStructure(): Promise<OrgStructure> {
  const setting = await prisma.setting.findUnique({
    where: { key: STRUCTURE_KEY },
  });

  if (!setting) return defaultStructure;

  try {
    const parsed = JSON.parse(setting.value);
    return { ...defaultStructure, ...parsed };
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
