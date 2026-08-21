"use server";

import { revalidatePath } from "next/cache";

import { categoryService } from "@/modules/cms/application/category.service";
import { categorySchema } from "@/modules/cms/validations/category.schema";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";

const CATEGORY_PATH = "/admin/content/categories";

const PERMISSION_CREATE = ["content.category.create"];
const PERMISSION_UPDATE = ["content.category.update"];
const PERMISSION_DELETE = ["content.category.delete"];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function createCategory(formData: FormData) {
  try {
    await requireSessionWithPermissions(PERMISSION_CREATE);

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
    await requireSessionWithPermissions(PERMISSION_UPDATE);

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
    await requireSessionWithPermissions(PERMISSION_DELETE);

    await categoryService.delete(id);

    revalidatePath(CATEGORY_PATH);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error) };
  }
}
