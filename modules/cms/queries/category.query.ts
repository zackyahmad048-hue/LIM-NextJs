import { getPayloadClient } from "@/modules/cms/infrastructure/payload";

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
  const payload = await getPayloadClient();

  const res = await payload.find({
    collection: "categories",
    where: {
      deletedAt: { exists: false },
      ...(search
        ? {
            or: [{ name: { like: search } }, { slug: { like: search } }],
          }
        : {}),
    },
    limit: 1000,
    sort: "-createdAt",
    depth: 0,
  });

  const posts = await payload.find({
    collection: "posts",
    where: { deletedAt: { exists: false } },
    limit: 10000,
    depth: 0,
    select: { category: true },
  });

  const postCountByCategory = new Map<string, number>();
  for (const post of posts.docs) {
    const category = post.category;
    if (category === null || category === undefined) continue;
    const catId =
      typeof category === "object" &&
      category !== null &&
      "id" in category
        ? String(category.id)
        : String(category);
    postCountByCategory.set(
      catId,
      (postCountByCategory.get(catId) ?? 0) + 1,
    );
  }

  return res.docs.map((doc) => ({
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? null,
    deletedAt: null,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
    _count: { posts: postCountByCategory.get(String(doc.id)) ?? 0 },
  }));
}
