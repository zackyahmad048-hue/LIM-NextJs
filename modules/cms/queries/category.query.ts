import { prisma } from "@/modules/shared/infrastructure/prisma";

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { posts: number };
}

export async function getCategories(
  search?: string,
): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
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
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
