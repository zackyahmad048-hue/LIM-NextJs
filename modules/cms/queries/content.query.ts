import { prisma } from "@/modules/shared/infrastructure/prisma";

export async function getContentSummary() {
  const [categoryCount, postCount, publishedPostCount] = await Promise.all([
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { published: true, deletedAt: null } }),
  ]);

  return { categoryCount, postCount, publishedPostCount };
}
