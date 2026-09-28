import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

export async function getContentSummary() {
  const payload = await getPayloadClient();
  const [categoryCount, postCount, publishedPostCount] = await Promise.all([
    payload.count({ collection: "categories" }),
    payload.count({ collection: "posts" }),
    payload.count({
      collection: "posts",
      where: { published: { equals: true } },
    }),
  ]);

  return {
    categoryCount: categoryCount.totalDocs,
    postCount: postCount.totalDocs,
    publishedPostCount: publishedPostCount.totalDocs,
  };
}
