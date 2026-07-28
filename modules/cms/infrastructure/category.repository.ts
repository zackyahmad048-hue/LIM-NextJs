import { Prisma } from "@/generated/client";

import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type { CategoryRepository } from "../domain/category.repository";

export class PrismaCategoryRepository extends BaseRepository implements CategoryRepository {
  async findMany(search?: string) {
    return this.db.category.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findActiveById(id: string) {
    return this.db.category.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findBySlug(slug: string) {
    return this.db.category.findFirst({
      where: { slug, deletedAt: null },
    });
  }

  async checkSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.db.category.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return existing !== null;
  }

  async checkNameTaken(name: string, excludeId?: string): Promise<boolean> {
    const existing = await this.db.category.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return existing !== null;
  }

  async countPosts(categoryId: string): Promise<number> {
    return this.db.post.count({ where: { categoryId } });
  }

  async create(data: { name: string; slug: string; description?: string }) {
    return this.db.category.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; slug?: string; description?: string }
  ) {
    try {
      return await this.db.category.update({ where: { id }, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Slug sudah digunakan.");
      }
      throw error;
    }
  }

  async softDelete(id: string) {
    const category = await this.db.category.findUnique({ where: { id } });

    return this.db.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        slug: `${category?.slug}__deleted_${id}`,
      },
    });
  }
}

export const categoryRepository = new PrismaCategoryRepository();
