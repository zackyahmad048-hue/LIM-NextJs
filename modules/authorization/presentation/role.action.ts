"use server";

import { revalidatePath } from "next/cache";

import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";
import { roleSchema } from "@/modules/authorization/validations/role.schema";
import { PrismaRoleRepository } from "@/modules/authorization/infrastructure/role.repository";

const repository = new PrismaRoleRepository();

export async function createRoleAction(formData: FormData) {
  await requireSessionWithPermissions(["system.role.create"]);

  const parsed = roleSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });

  await repository.create(parsed);

  revalidatePath("/admin/system/roles");
}
