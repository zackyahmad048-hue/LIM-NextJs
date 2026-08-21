import { organizationService } from "../application/service";

export async function getOrganizationTree() {
  return organizationService.getUnitTree();
}

export async function getOrganizationStats() {
  return organizationService.getOrganizationStats();
}

export async function getUnitById(id: string) {
  return organizationService.getUnitById(id);
}

export async function getOfficers(unitId: string) {
  return organizationService.listOfficers(unitId);
}

export async function getOfficerById(id: string) {
  return organizationService.getOfficerById(id);
}

/**
 * Opsi tingkat kepengurusan untuk nomor surat, diambil dari data
 * Pendataan (PP, Bidang, PW, dan PC). Urutan: PP → Bidang → PW → PC.
 */
export async function getLetterLevelOptions() {
  const tree = await organizationService.getUnitTree();
  const options: { code: string; label: string }[] = [];

  const walk = (node: (typeof tree)[number], depth: number) => {
    options.push({
      code: node.code,
      label:
        depth === 0
          ? `${node.code} — ${node.name}`
          : `${node.code} — ${node.name}`,
    });
    for (const child of node.children) walk(child, depth + 1);
  };

  for (const root of tree) walk(root, 0);
  return options;
}

export interface SignerCandidate {
  name: string;
  position: string;
}

export interface LevelSigners {
  ketua: SignerCandidate | null;
  sekretaris: SignerCandidate | null;
}

export interface OfficerWithUnitCode {
  officer: {
    name: string;
    position: string;
    isLeader: boolean;
  };
  unitCode: string;
}

/**
 * Menyusun kandidat penanda tangan per kode unit dari daftar pengurus.
 * Ketua diambil dari pengurus yang bertanda pemimpin (`isLeader`),
 * Sekretaris dari posisi yang mengandung "Sekretaris".
 */
export function buildSignerMap(
  codes: string[],
  rows: OfficerWithUnitCode[],
): Record<string, LevelSigners> {
  const result: Record<string, LevelSigners> = {};
  for (const code of codes) {
    result[code] = { ketua: null, sekretaris: null };
  }

  for (const { officer, unitCode } of rows) {
    const target = result[unitCode];
    if (!target) continue;

    if (!target.ketua && officer.isLeader) {
      target.ketua = { name: officer.name, position: officer.position };
      continue;
    }
    if (!target.sekretaris && /sekretaris/i.test(officer.position)) {
      target.sekretaris = {
        name: officer.name,
        position: officer.position,
      };
    }
  }

  return result;
}

/**
 * Kandidat penanda tangan per tingkat kepengurusan (kode unit).
 */
export async function getSignerCandidatesByLevels(
  codes: string[],
): Promise<Record<string, LevelSigners>> {
  if (codes.length === 0) return {};

  const rows = await organizationService.listOfficersByUnitCodes(codes);
  return buildSignerMap(codes, rows);
}
