import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type { RoleRepository } from "../domain/role.repository";
import { Role } from "../domain/role.entity";

export class PrismaRoleRepository
  extends BaseRepository
  implements RoleRepository
{
  async findAll(): Promise<Role[]> {
    const roles = await this.db.role.findMany({
      orderBy: { name: "asc" },
    });

    return roles.map((role) =>
      Role.create({
        id: role.id,
        name: role.name,
        slug: role.slug,
        description: role.description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }),
    );
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.db.role.findUnique({ where: { id } });
    if (!role) return null;

    return Role.create({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<Role | null> {
    const role = await this.db.role.findUnique({ where: { slug } });
    if (!role) return null;

    return Role.create({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Role> {
    const role = await this.db.role.create({ data });

    return Role.create({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; description: string }>,
  ): Promise<Role> {
    const role = await this.db.role.update({ where: { id }, data });

    return Role.create({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.role.delete({ where: { id } });
  }

  async upsertBySlug(slug: string, name: string): Promise<Role> {
    const role = await this.db.role.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });

    return Role.create({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  async assignToUser(roleId: string, userId: string): Promise<void> {
    await this.db.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId },
    });
  }
}
