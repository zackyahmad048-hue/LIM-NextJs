import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { OrganizationStructure as PayloadOrganizationStructure } from "@/payload-types";

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

interface PayloadBoardMember {
  id: string;
  name: string;
  position: string;
  image?: string | null;
  sortOrder?: number | null;
}

function toBoardMember(member: PayloadBoardMember): BoardMember {
  return {
    id: member.id,
    name: member.name,
    position: member.position,
    image: member.image ?? "",
    sortOrder: member.sortOrder ?? 0,
  };
}

function payloadToStructure(
  doc: PayloadOrganizationStructure,
): OrgStructure | null {
  const centralBoard = (doc.centralBoard ?? []).map(toBoardMember);
  const members = (doc.members ?? []).map(toBoardMember);
  const regionalBoards = (doc.regionalBoards ?? []).map((board) => ({
    id: board.id,
    province: board.province,
    name: board.name,
    members: (board.members ?? []).map(toBoardMember),
  }));
  const branchBoards = (doc.branchBoards ?? []).map((board) => ({
    id: board.id,
    province: board.province,
    regency: board.regency,
    name: board.name,
    members: (board.members ?? []).map(toBoardMember),
  }));
  const organizationName = doc.organization?.name?.trim();
  const hasContent =
    Boolean(organizationName) ||
    centralBoard.length > 0 ||
    regionalBoards.length > 0 ||
    branchBoards.length > 0 ||
    members.length > 0;
  if (!hasContent) return null;

  const organization = doc.organization;
  return {
    organization: {
      name: organization?.name ?? defaultStructure.organization.name,
      shortName: organization?.shortName ?? "",
      logo: organization?.logo ?? "",
      address: organization?.address ?? "",
      phone: organization?.phone ?? "",
      email: organization?.email ?? "",
      website: organization?.website ?? "",
    },
    googleSheetUrl: doc.googleSheetUrl ?? "",
    centralBoard,
    regionalBoards,
    branchBoards,
    members,
  };
}

export async function getStructure(): Promise<OrgStructure> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "organization-structure" });
    const fromPayload = payloadToStructure(doc);
    if (fromPayload) return fromPayload;
  } catch {
    // Payload tidak tersedia → pakai default
  }

  return defaultStructure;
}

export async function saveStructure(data: OrgStructure) {
  const payload = await getPayloadClient();
  await payload.updateGlobal({
    slug: "organization-structure",
    data: {
      organization: data.organization,
      googleSheetUrl: data.googleSheetUrl,
      centralBoard: data.centralBoard.map((member) => ({
        id: member.id,
        name: member.name,
        position: member.position,
        image: member.image,
        sortOrder: member.sortOrder,
      })),
      regionalBoards: data.regionalBoards.map((board) => ({
        id: board.id,
        province: board.province,
        name: board.name,
        members: board.members.map((member) => ({
          id: member.id,
          name: member.name,
          position: member.position,
          image: member.image,
          sortOrder: member.sortOrder,
        })),
      })),
      branchBoards: data.branchBoards.map((board) => ({
        id: board.id,
        province: board.province,
        regency: board.regency,
        name: board.name,
        members: board.members.map((member) => ({
          id: member.id,
          name: member.name,
          position: member.position,
          image: member.image,
          sortOrder: member.sortOrder,
        })),
      })),
      members: data.members.map((member) => ({
        id: member.id,
        name: member.name,
        position: member.position,
        image: member.image,
        sortOrder: member.sortOrder,
      })),
    },
  });
}

export interface CentralBoardSigners {
  ketua: BoardMember[];
  sekretaris: BoardMember[];
}

/**
 * Kandidat penanda tangan dari struktur Pengurus Pusat (centralBoard).
 * Ketua = posisi mengandung "Ketua"; Sekretaris = posisi mengandung
 * "Sekretaris". Dipakai untuk select penanda tangan pada surat keluar.
 */
export async function getCentralBoardSigners(): Promise<CentralBoardSigners> {
  const structure = await getStructure();
  return {
    ketua: structure.centralBoard.filter((member) =>
      /ketua/i.test(member.position),
    ),
    sekretaris: structure.centralBoard.filter((member) =>
      /sekretaris/i.test(member.position),
    ),
  };
}