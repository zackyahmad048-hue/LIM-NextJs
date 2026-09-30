import {
  findRecentPosts,
  findPublishedPostsByCategorySlug,
  findPublishedPostBySlug,
  findPaginatedPosts,
} from "../infrastructure/post.repository";

export async function getRecentPosts(limit = 20) {
  return findRecentPosts(limit);
}

export async function getPublishedPostsByCategorySlug(
  categorySlug: string,
  limit = 6,
) {
  return findPublishedPostsByCategorySlug(categorySlug, limit);
}

export async function getPublishedPostBySlug(slug: string) {
  return findPublishedPostBySlug(slug);
}

export async function getPaginatedPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
  categoryId?: string;
}) {
  return findPaginatedPosts(
    params.page ?? 1,
    params.limit ?? 20,
    params.search,
    params.status as any,
  );
}