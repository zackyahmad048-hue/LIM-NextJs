import { prisma } from "@/modules/shared/infrastructure/prisma";
import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

export async function getDashboardMetrics() {
  const payload = await getPayloadClient();
  const [categoryCount, postCount, publishedPostCount, userCount] =
    await Promise.all([
      payload.count({ collection: "categories" }),
      payload.count({ collection: "posts" }),
      payload.count({
        collection: "posts",
        where: { published: { equals: true } },
      }),
      prisma.user.count(),
    ]);

  return {
    categoryCount: categoryCount.totalDocs,
    postCount: postCount.totalDocs,
    publishedPostCount: publishedPostCount.totalDocs,
    userCount,
  };
}
