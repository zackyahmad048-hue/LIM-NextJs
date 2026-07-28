import { Prisma } from "@/generated/client";

import { BaseRepository } from "@/modules/shared/infrastructure/base.repository";
import type { PostRepository } from "../domain/post.repository";

export class PrismaPostRepository extends BaseRepository implements PostRepository {
  async countAll(): Promise<number> {
    return this.db.post.count();
  }

  async countPublished(): Promise<number> {
    return this.db.post.count({ where: { published: true } });
  }

  async findRecent(limit = 20) {
    return this.db.post.findMany({
      include: { author: true, category: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  }

  async findById(id: string) {
    return this.db.post.findUnique({ where: { id } });
  }

  async findPaginated({
    page,
    limit,
    search,
    status,
    categoryId,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: "draft" | "published" | "archived";
    categoryId?: string;
  }) {
    const where: Prisma.PostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "published") where.published = true;
    else if (status === "draft") {
      where.published = false;
      where.publishedAt = null;
    } else if (status === "archived") {
      where.published = false;
      where.publishedAt = { not: null };
    }

    if (categoryId) where.categoryId = categoryId;

    const [posts, total] = await Promise.all([
      this.db.post.findMany({
        where,
        include: { author: true, category: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.post.count({ where }),
    ]);

    return { posts, total };
  }

  async checkSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const existing = await this.db.post.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return existing !== null;
  }

  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    categoryId: string;
    authorId: string;
  }) {
    return this.db.post.create({ data });
  }

  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      thumbnail?: string;
      categoryId?: string;
    }
  ) {
    return this.db.post.update({ where: { id }, data });
  }

  async publish(id: string) {
    return this.db.post.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
    });
  }

  async archive(id: string) {
    return this.db.post.update({
      where: { id },
      data: { published: false },
    });
  }

  async restoreToDraft(id: string) {
    return this.db.post.update({
      where: { id },
      data: { published: false, publishedAt: null },
    });
  }

  async delete(id: string) {
    await this.db.post.delete({ where: { id } });
  }
}

export const postRepository = new PrismaPostRepository();
