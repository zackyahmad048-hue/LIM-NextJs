import { postRepository } from "../infrastructure/post.repository";
import { categoryRepository } from "../infrastructure/category.repository";

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
      postRepository.checkSlugTaken(data.slug),
      categoryRepository.findActiveById(data.categoryId),
    ]);

    if (slugExists) throw new Error("Slug sudah digunakan.");
    if (!category) throw new Error("Kategori tidak ditemukan.");

    return postRepository.create(data);
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
    const post = await postRepository.findById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");

    if (data.slug) {
      const slugExists = await postRepository.checkSlugTaken(data.slug, id);
      if (slugExists) throw new Error("Slug sudah digunakan.");
    }

    if (data.categoryId) {
      const category = await categoryRepository.findActiveById(data.categoryId);
      if (!category) throw new Error("Kategori tidak ditemukan.");
    }

    return postRepository.update(id, data);
  }

  async publish(id: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (!post.title.trim()) throw new Error("Judul wajib diisi.");
    if (!post.slug.trim()) throw new Error("Slug wajib diisi.");
    if (!post.content.trim()) throw new Error("Konten wajib diisi.");

    const category = await categoryRepository.findActiveById(post.categoryId);
    if (!category) throw new Error("Kategori tidak ditemukan.");

    return postRepository.publish(id);
  }

  async archive(id: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (!post.published)
      throw new Error("Hanya berita published yang dapat diarsipkan.");

    return postRepository.archive(id);
  }

  async restoreToDraft(id: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");
    if (post.published)
      throw new Error("Berita published tidak perlu dipulihkan.");

    return postRepository.restoreToDraft(id);
  }

  async delete(id: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error("Berita tidak ditemukan.");

    return postRepository.delete(id);
  }
}

export const postService = new PostService();
