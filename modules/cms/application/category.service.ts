import { categoryRepository } from "../infrastructure/category.repository";

export class CategoryService {
  async create(data: { name: string; slug: string; description?: string }) {
    const [nameExists, slugExists] = await Promise.all([
      categoryRepository.checkNameTaken(data.name),
      categoryRepository.checkSlugTaken(data.slug),
    ]);

    if (nameExists) throw new Error("Nama kategori sudah digunakan.");
    if (slugExists) throw new Error("Slug sudah digunakan.");

    return categoryRepository.create(data);
  }

  async update(
    id: string,
    data: { name: string; slug: string; description?: string },
  ) {
    const category = await categoryRepository.findActiveById(id);
    const [nameDuplicate, slugDuplicate] = await Promise.all([
      categoryRepository.checkNameTaken(data.name, id),
      categoryRepository.checkSlugTaken(data.slug, id),
    ]);

    if (!category) throw new Error("Kategori tidak ditemukan.");
    if (nameDuplicate) throw new Error("Nama kategori sudah digunakan.");
    if (slugDuplicate) throw new Error("Slug sudah digunakan.");

    return categoryRepository.update(id, data);
  }

  async delete(id: string) {
    const category = await categoryRepository.findActiveById(id);

    if (!category) throw new Error("Kategori tidak ditemukan.");

    const postCount = await categoryRepository.countPosts(id);

    if (postCount > 0) {
      throw new Error("Kategori masih digunakan oleh berita.");
    }

    return categoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
