import type { Category as PrismaCategory } from "@/generated/client";

export interface CategoryRepository {
  findMany(search?: string): Promise<PrismaCategory[]>;
  findActiveById(id: string): Promise<PrismaCategory | null>;
  findBySlug(slug: string): Promise<PrismaCategory | null>;
  checkSlugTaken(slug: string, excludeId?: string): Promise<boolean>;
  checkNameTaken(name: string, excludeId?: string): Promise<boolean>;
  countPosts(categoryId: string): Promise<number>;
  create(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<PrismaCategory>;
  update(
    id: string,
    data: { name?: string; slug?: string; description?: string },
  ): Promise<PrismaCategory>;
  softDelete(id: string): Promise<PrismaCategory>;
}
