"use server";

import { revalidatePath } from "next/cache";

import { categoryService } from "@/modules/cms/application/category.service";
import { categorySchema } from "@/modules/cms/validations/category.schema";
import { requireSession } from "@/modules/shared/infrastructure/require-session";

const CATEGORY_PATH = "/admin/content/categories";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function createCategory(formData: FormData) {
  try {
    await requireSession();

    const parsed = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    await categoryService.create(parsed);

    revalidatePath(CATEGORY_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    await requireSession();

    const parsed = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description") || undefined,
    });

    await categoryService.update(id, parsed);

    revalidatePath(CATEGORY_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireSession();

    await categoryService.delete(id);

    revalidatePath(CATEGORY_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}
