"use server";

import { revalidatePath } from "next/cache";

import { postService } from "@/modules/cms/application/post.service";
import {
  postIdSchema,
  postSchema,
} from "@/modules/cms/validations/post.schema";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";

const POST_PATH = "/admin/content/posts";

const PERMISSION_CREATE = ["content.post.create"];
const PERMISSION_UPDATE = ["content.post.update"];
const PERMISSION_PUBLISH = ["content.post.publish"];
const PERMISSION_DELETE = ["content.post.delete"];

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return "Sesi tidak valid. Silakan login kembali.";
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return "Anda tidak memiliki izin untuk melakukan aksi ini.";
  }
  return error instanceof Error ? error.message : "Terjadi kesalahan.";
}

export async function createPost(formData: FormData) {
  try {
    const session = await requireSessionWithPermissions(PERMISSION_CREATE);

    const parsed = postSchema.parse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || undefined,
      content: formData.get("content"),
      categoryId: formData.get("categoryId"),
      thumbnail: formData.get("thumbnail") || undefined,
    });

    await postService.create({
      ...parsed,
      excerpt: parsed.excerpt || undefined,
      thumbnail: parsed.thumbnail || undefined,
      authorId: session.user.id,
    });

    revalidatePath(POST_PATH);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    await requireSessionWithPermissions(PERMISSION_UPDATE);

    const parsed = postSchema.parse({
      title: formData.get("title"),
      slug: formData.get("slug"),
      excerpt: formData.get("excerpt") || undefined,
      content: formData.get("content"),
      categoryId: formData.get("categoryId"),
      thumbnail: formData.get("thumbnail") || undefined,
    });

    await postService.update(postIdSchema.parse(id), {
      ...parsed,
      excerpt: parsed.excerpt || undefined,
      thumbnail: parsed.thumbnail || undefined,
    });

    revalidatePath(POST_PATH);
    revalidatePath(`${POST_PATH}/${id}`);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}

export async function publishPost(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_PUBLISH);
    await postService.publish(postIdSchema.parse(id));

    revalidatePath(POST_PATH);
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}

export async function archivePost(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DELETE);
    await postService.archive(postIdSchema.parse(id));

    revalidatePath(POST_PATH);
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}

export async function restorePostToDraft(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_UPDATE);
    await postService.restoreToDraft(postIdSchema.parse(id));

    revalidatePath(POST_PATH);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}

export async function deletePost(id: string) {
  try {
    await requireSessionWithPermissions(PERMISSION_DELETE);
    await postService.delete(postIdSchema.parse(id));

    revalidatePath(POST_PATH);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, message: getErrorMessage(error) };
  }
}
