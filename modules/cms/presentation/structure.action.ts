"use server";

import { saveStructure } from "@/modules/cms/queries/structure.query";
import type { OrgStructure } from "@/modules/cms/queries/structure.query";
import { orgStructureSchema } from "@/modules/cms/validations/structure.schema";
import { defineAction } from "@/modules/shared/presentation/define-action";

const REVALIDATE_PATHS = [
  "/admin/profil/pengurus-pusat",
  "/profil/pengurus-pusat",
] as const;

export const saveStructureAction = defineAction<OrgStructure, void>({
  permission: "structure.update",
  schema: orgStructureSchema,
  revalidate: REVALIDATE_PATHS,
  handler: async (data) => {
    await saveStructure(data);
  },
});
