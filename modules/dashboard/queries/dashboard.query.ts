import { prisma } from "@/modules/shared/infrastructure/prisma";

export async function getDashboardMetrics() {
  const [categoryCount, postCount, publishedPostCount, userCount] =
    await Promise.all([
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.user.count(),
    ]);

  return { categoryCount, postCount, publishedPostCount, userCount };
}
