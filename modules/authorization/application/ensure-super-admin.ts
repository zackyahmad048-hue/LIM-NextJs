import { PrismaUserRepository } from "@/modules/authentication/infrastructure/user.repository";
import { PrismaRoleRepository } from "../infrastructure/role.repository";

const userRepository = new PrismaUserRepository();
const roleRepository = new PrismaRoleRepository();

const SUPER_ADMIN_SLUG = "super-admin";
const SUPER_ADMIN_NAME = "Super Admin";

export async function ensureSuperAdminRole(
  email: string,
): Promise<boolean> {
  const user = await userRepository.findByEmail(email);
  if (!user) return false;

  const role = await roleRepository.upsertBySlug(
    SUPER_ADMIN_SLUG,
    SUPER_ADMIN_NAME,
  );

  await roleRepository.assignToUser(role.id, user.id);
  return true;
}
