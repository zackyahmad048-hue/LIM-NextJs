import { getPayloadClient } from "../infrastructure/payload";
import type { Post, Category } from "@/payload-types";

const POST_DELETED = { deletedAt: { exists: false } } as const;
const CATEGORY_DELETED = { deletedAt: { exists: false } } as const;

function toPost(data: any): Post {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? null,
    content: data.content ?? null,
    thumbnail: data.thumbnail ?? null,
    category: data.category,
    author: data.author,
    published: data.published ?? false,
    publishedAt: data.publishedAt ?? null,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt ?? null,
  };
}

function toCategory(data: any): Category {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    deletedAt: data.deletedAt ?? null,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  };
}

export async function countPostsAll(): Promise<number> {
  const client = await getPayloadClient();
  const res = await client.count({ collection: "posts", where: POST_DELETED });
  return res.totalDocs;
}

export async function countPostsPublished(): Promise<number> {
  const client = await getPayloadClient();
  const res = await client.count({
    collection: "posts",
    where: { ...POST_DELETED, published: { equals: true } },
  });
  return res.totalDocs;
}

export async function countPostsDraft(): Promise<number> {
  const client = await getPayloadClient();
  const res = await client.count({
    collection: "posts",
    where: {
      ...POST_DELETED,
      published: { equals: false },
      publishedAt: { exists: false },
    },
  });
  return res.totalDocs;
}

export async function countPostsByCategory(
  categoryId: string | number,
): Promise<number> {
  const client = await getPayloadClient();
  const res = await client.count({
    collection: "posts",
    where: { ...POST_DELETED, category: { equals: categoryId } },
  });
  return res.totalDocs;
}

export async function findRecentPosts(take: number): Promise<Post[]> {
  const client = await getPayloadClient();
  const res = await client.find({
    collection: "posts",
    where: POST_DELETED,
    depth: 1,
    limit: take,
    sort: "-updatedAt",
  });
  return res.docs.map(toPost);
}

export async function findPublishedPostsByCategorySlug(
  categorySlug: string,
  take: number,
): Promise<Post[]> {
  const client = await getPayloadClient();
  const res = await client.find({
    collection: "posts",
    where: {
      ...POST_DELETED,
      published: { equals: true },
      publishedAt: { exists: true },
      "category.slug": { equals: categorySlug },
    },
    depth: 1,
    limit: take,
    sort: "-publishedAt",
  });
  return res.docs.map(toPost);
}

export async function findPublishedPostBySlug(slug: string): Promise<Post | null> {
  const client = await getPayloadClient();
  const res = await client.find({
    collection: "posts",
    where: { ...POST_DELETED, slug: { equals: slug }, published: { equals: true }, publishedAt: { exists: true } },
    depth: 1,
    limit: 1,
  });
  return res.docs[0] ? toPost(res.docs[0]) : null;
}

export async function findPostById(id: string | number): Promise<Post | null> {
  const client = await getPayloadClient();
  const res = await client.findByID({ collection: "posts", id: String(id), depth: 1 });
  return res ? toPost(res) : null;
}

export async function findPaginatedPosts(
  page: number,
  limit: number,
  search?: string,
  status?: "all" | "published" | "draft" | "archived",
): Promise<{ posts: Post[]; total: number }> {
  const client = await getPayloadClient();

  const where: any = { ...POST_DELETED };

  if (search) {
    where.or = [
      { title: { contains: search, caseSensitive: false } },
      { slug: { contains: search, caseSensitive: false } },
    ];
  }

  if (status === "published") {
    where.published = { equals: true };
    where.publishedAt = { exists: true };
  } else if (status === "draft") {
    where.published = { equals: false };
    where.publishedAt = { equals: null };
  } else if (status === "archived") {
    where.published = { equals: false };
    where.publishedAt = { exists: true };
  }

  const res = await client.find({
    collection: "posts",
    where,
    depth: 1,
    page,
    limit,
    sort: "-updatedAt",
  });

  return { posts: res.docs.map(toPost), total: res.totalDocs };
}

export async function checkPostSlugTaken(
  slug: string,
  excludeId?: string | number,
): Promise<boolean> {
  const client = await getPayloadClient();
  const where: any = { slug: { equals: slug }, ...POST_DELETED };
  if (excludeId) where.id = { not_equals: String(excludeId) };
  const res = await client.find({ collection: "posts", where, limit: 1 });
  return res.totalDocs > 0;
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  categoryId: string | number;
  authorId: string | number;
}): Promise<Post> {
  const client = await getPayloadClient();
  const res = await client.create({
    collection: "posts",
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      thumbnail: data.thumbnail,
      category: Number(data.categoryId),
      author: Number(data.authorId),
    },
    depth: 1,
  });
  return toPost(res);
}

export async function updatePost(
  id: string | number,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string;
    categoryId: string | number;
  }>,
): Promise<Post> {
  const client = await getPayloadClient();
  const { categoryId, ...rest } = data;
  const res = await client.update({
    collection: "posts",
    id: String(id),
    data: { ...rest, ...(categoryId ? { category: Number(categoryId) } : {}) },
    depth: 1,
  });
  return toPost(res);
}

export async function publishPost(id: string | number): Promise<Post> {
  const client = await getPayloadClient();
  const res = await client.update({
    collection: "posts",
    id: String(id),
    data: { published: true, publishedAt: new Date().toISOString() },
    depth: 1,
  });
  return toPost(res);
}

export async function archivePost(id: string | number): Promise<Post> {
  const client = await getPayloadClient();
  const res = await client.update({
    collection: "posts",
    id: String(id),
    data: { published: false },
    depth: 1,
  });
  return toPost(res);
}

export async function restorePostToDraft(id: string | number): Promise<Post> {
  const client = await getPayloadClient();
  const res = await client.update({
    collection: "posts",
    id: String(id),
    data: { published: false, publishedAt: null },
    depth: 1,
  });
  return toPost(res);
}

export async function softDeletePost(id: string | number): Promise<void> {
  const client = await getPayloadClient();
  await client.update({
    collection: "posts",
    id: String(id),
    data: { deletedAt: new Date().toISOString() },
  });
}

export async function countCategoriesAll(): Promise<number> {
  const client = await getPayloadClient();
  const res = await client.count({ collection: "categories", where: CATEGORY_DELETED });
  return res.totalDocs;
}

export async function findCategories(options?: {
  search?: string;
  limit?: number;
  page?: number;
}): Promise<{ categories: Category[]; total: number }> {
  const client = await getPayloadClient();
  const where: any = { ...CATEGORY_DELETED };

  if (options?.search) {
    where.or = [
      { name: { contains: options.search, caseSensitive: false } },
      { slug: { contains: options.search, caseSensitive: false } },
    ];
  }

  const res = await client.find({
    collection: "categories",
    where,
    limit: options?.limit ?? 100,
    page: options?.page ?? 1,
    sort: "-createdAt",
  });
  return { categories: res.docs.map(toCategory), total: res.totalDocs };
}

export async function findCategoryById(id: string | number): Promise<Category | null> {
  const client = await getPayloadClient();
  const res = await client.findByID({ collection: "categories", id: String(id), depth: 0 });
  return res ? toCategory(res) : null;
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  const client = await getPayloadClient();
  const res = await client.find({
    collection: "categories",
    where: { ...CATEGORY_DELETED, slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  return res.docs[0] ? toCategory(res.docs[0]) : null;
}

export async function checkCategorySlugTaken(
  slug: string,
  excludeId?: string | number,
): Promise<boolean> {
  const client = await getPayloadClient();
  const where: any = { slug: { equals: slug }, ...CATEGORY_DELETED };
  if (excludeId) where.id = { not_equals: String(excludeId) };
  const res = await client.find({ collection: "categories", where, limit: 1 });
  return res.totalDocs > 0;
}

export async function checkCategoryNameTaken(
  name: string,
  excludeId?: string | number,
): Promise<boolean> {
  const client = await getPayloadClient();
  const where: any = { name: { equals: name, caseSensitive: false }, ...CATEGORY_DELETED };
  if (excludeId) where.id = { not_equals: String(excludeId) };
  const res = await client.find({ collection: "categories", where, limit: 1 });
  return res.totalDocs > 0;
}

export async function createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
  const client = await getPayloadClient();
  const res = await client.create({
    collection: "categories",
    data: { name: data.name, slug: data.slug, description: data.description },
    depth: 0,
  });
  return toCategory(res);
}

export async function updateCategory(
  id: string | number,
  data: Partial<{ name: string; slug: string; description: string }>,
): Promise<Category> {
  const client = await getPayloadClient();
  const res = await client.update({
    collection: "categories",
    id: String(id),
    data,
    depth: 0,
  });
  return toCategory(res);
}

export async function softDeleteCategory(id: string | number): Promise<Category> {
  const client = await getPayloadClient();
  const existing = await client.findByID({ collection: "categories", id: String(id), depth: 0 });
  if (!existing) throw new Error("Category not found");

  const newSlug = `${existing.slug}__deleted_${id}`;
  const res = await client.update({
    collection: "categories",
    id: String(id),
    data: { deletedAt: new Date().toISOString(), slug: newSlug },
    depth: 0,
  });
  return toCategory(res);
}