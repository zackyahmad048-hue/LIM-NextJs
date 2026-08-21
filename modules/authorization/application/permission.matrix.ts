import { PERMISSIONS } from "@/config/permission";

import type { PermissionMatrix, PermissionSlug } from "./permission.service";

type PermissionTree = { [key: string]: PermissionSlug | PermissionTree };

export function flattenPermissions(tree: PermissionTree): PermissionSlug[] {
  return Object.values(tree).flatMap((value) =>
    typeof value === "string" ? [value] : flattenPermissions(value),
  );
}

const ALL = flattenPermissions(PERMISSIONS);
const CONTENT = flattenPermissions(PERMISSIONS.CONTENT);
const FALAK = flattenPermissions(PERMISSIONS.FALAK);
const PROGRAM = flattenPermissions(PERMISSIONS.PROGRAM);
const TWK = flattenPermissions(PERMISSIONS.TWK);
const SECRETARIAT = flattenPermissions(PERMISSIONS.SECRETARIAT);
const ORGANIZATION = flattenPermissions(PERMISSIONS.ORGANIZATION);
const REPORTS = flattenPermissions(PERMISSIONS.REPORTS);

const READ_ONLY: PermissionSlug[] = [
  "content.category.read",
  "content.post.read",
  "falak.prayer-time.view",
  "falak.qibla.view",
  "falak.hijri.view",
  "falak.hisab.view",
  "falak.rukyat.view",
  "falak.eclipse.view",
  "program.view",
  "program.schedule.view",
  "program.committee.view",
  "program.participant.view",
  "program.attendance.view",
  "program.documentation.view",
  "secretariat.view",
  "secretariat.agenda.view",
  "secretariat.archive.view",
  "organization.unit.view",
  "organization.officer.view",
  "twk.member.view",
  "twk.lembaga.view",
];

export const DEFAULT_PERMISSION_MATRIX: PermissionMatrix = {
  "super-admin": "*",
  administrator: ALL,
  editor: CONTENT,
  operator: [...FALAK, ...PROGRAM, ...TWK],
  sekretaris: [...SECRETARIAT, ...ORGANIZATION, ...REPORTS],
  viewer: READ_ONLY,
};
