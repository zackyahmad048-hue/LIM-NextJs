import { PrismaPostRepository } from "../infrastructure/post.repository";

const repository = new PrismaPostRepository();

export async function getRecentPosts(limit = 20) {
  return repository.findRecent(limit);
}

export async function getPublishedPostsByCategorySlug(
  categorySlug: string,
  limit = 6,
) {
  return repository.findPublishedByCategorySlug(categorySlug, limit);
}

export async function getPublishedPostBySlug(slug: string) {
  return repository.findPublishedBySlug(slug);
}

export async function getPaginatedPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
  categoryId?: string;
}) {
  return repository.findPaginated({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search,
    status: params.status,
    categoryId: params.categoryId,
  });
}
