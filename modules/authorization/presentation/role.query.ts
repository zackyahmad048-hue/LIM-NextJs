import { PrismaRoleRepository } from "@/modules/authorization/infrastructure/role.repository";

const repository = new PrismaRoleRepository();

export async function getRoles() {
  return repository.findAll();
}


