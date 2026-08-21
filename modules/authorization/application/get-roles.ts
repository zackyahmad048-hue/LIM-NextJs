import { Role } from "../domain/role.entity";
import { PrismaRoleRepository } from "../infrastructure/role.repository";

const repository = new PrismaRoleRepository();

export async function getRoles(): Promise<Role[]> {
  return repository.findAll();
}

export async function getRoleById(id: string): Promise<Role | null> {
  return repository.findById(id);
}

export async function getRoleBySlug(slug: string): Promise<Role | null> {
  return repository.findBySlug(slug);
}
