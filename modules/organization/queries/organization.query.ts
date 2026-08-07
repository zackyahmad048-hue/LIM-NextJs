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
