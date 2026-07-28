import type { Post as PrismaPost, User, Category } from "@/generated/client";

type PostWithRelations = PrismaPost & { author: User; category: Category };

export interface PostRepository {
  countAll(): Promise<number>;
  countPublished(): Promise<number>;
  findRecent(limit?: number): Promise<PostWithRelations[]>;
  findById(id: string): Promise<PrismaPost | null>;
  findPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    status?: "draft" | "published" | "archived";
    categoryId?: string;
  }): Promise<{ posts: PostWithRelations[]; total: number }>;
  create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    categoryId: string;
    authorId: string;
  }): Promise<PrismaPost>;
  update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      thumbnail?: string;
      categoryId?: string;
    }
  ): Promise<PrismaPost>;
  publish(id: string): Promise<PrismaPost>;
  archive(id: string): Promise<PrismaPost>;
  restoreToDraft(id: string): Promise<PrismaPost>;
  delete(id: string): Promise<void>;
  checkSlugTaken(slug: string, excludeId?: string): Promise<boolean>;
}
