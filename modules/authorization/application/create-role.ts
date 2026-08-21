import { Role } from "../domain/role.entity";
import { roleSchema, type RoleSchema } from "../validations/role.schema";
import { PrismaRoleRepository } from "../infrastructure/role.repository";

const repository = new PrismaRoleRepository();

export async function createRole(data: RoleSchema): Promise<Role> {
  const validated = roleSchema.parse(data);

  const existing = await repository.findBySlug(validated.slug);
  if (existing) {
    throw new Error("Role dengan slug ini sudah ada");
  }

  const role = await repository.create(validated);
  return role;
}
