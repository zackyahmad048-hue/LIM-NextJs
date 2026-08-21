import { PrismaRoleRepository } from "@/modules/authorization/infrastructure/role.repository";

const repository = new PrismaRoleRepository();

export async function getRoles() {
  return repository.findAll();
}

export async function getRoleById(id: string) {
  return repository.findById(id);
}

export async function getRoleBySlug(slug: string) {
  return repository.findBySlug(slug);
}
