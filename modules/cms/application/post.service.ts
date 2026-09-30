import {
  findCategoryById,
  findPostById,
  checkPostSlugTaken,
  createPost,
  updatePost,
  publishPost,
  archivePost,
  restorePostToDraft,
  softDeletePost,
} from "../infrastructure/post.repository";

export class PostService {
  async create(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    categoryId: string;
    authorId: string;
  }) {
    const [slugExists, category] = await Promise.all([
      checkPostSlugTaken(data.slug),
      findCategoryById(data.categoryId),
    ]);

    if (slugExists) throw new Error("Slug sudah digunakan.");
    if (!category) throw new Error("Kategori tidak ditemukan.");

    return createPost(data);
  }

  async update(
    id: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      thumbnail?: string;
      categoryId?: string;
    },
  ) {
    const post = await findPostById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");

    if (data.slug) {
      const slugExists = await checkPostSlugTaken(data.slug, id);
      if (slugExists) throw new Error("Slug sudah digunakan.");
    }

    if (data.categoryId) {
      const category = await findCategoryById(data.categoryId);
      if (!category) throw new Error("Kategori tidak ditemukan.");
    }

    return updatePost(id, data);
  }

  async publish(id: string) {
    const post = await findPostById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (!post.title.trim()) throw new Error("Judul wajib diisi.");
    if (!post.slug.trim()) throw new Error("Slug wajib diisi.");
    if (!post.content?.trim()) throw new Error("Konten wajib diisi.");

    const categoryId = typeof post.category === "number" ? post.category : post.category?.id;
    if (!categoryId) throw new Error("Kategori tidak ditemukan.");
    const category = await findCategoryById(categoryId);
    if (!category) throw new Error("Kategori tidak ditemukan.");

    return publishPost(id);
  }

  async archive(id: string) {
    const post = await findPostById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (!post.published)
      throw new Error("Hanya berita published yang dapat diarsipkan.");

    return archivePost(id);
  }

  async restoreToDraft(id: string) {
    const post = await findPostById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (post.published)
      throw new Error("Berita published tidak perlu dipulihkan.");

    return restorePostToDraft(id);
  }

  async delete(id: string) {
    const post = await findPostById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");

    return softDeletePost(id);
  }
}

export const postService = new PostService();