"use server";

import { revalidatePath } from "next/cache";

import { postService } from "@/modules/cms/application/post.service";
import { postIdSchema } from "@/modules/cms/validations/post.schema";
import { requireSessionWithPermissions } from "@/modules/authorization/application/permission.guard";

const POSTS_PATH = "/admin/content/posts";

export async function publishPost(id: string) {
  await requireSessionWithPermissions(["content.post.publish"]);
  await postService.publish(postIdSchema.parse(id));
  revalidatePath(POSTS_PATH);
  revalidatePath("/");
}

export async function archivePost(id: string) {
  await requireSessionWithPermissions(["content.post.delete"]);
  await postService.archive(postIdSchema.parse(id));
  revalidatePath(POSTS_PATH);
  revalidatePath("/");
}

export async function restorePostToDraft(id: string) {
  await requireSessionWithPermissions(["content.post.update"]);
  await postService.restoreToDraft(postIdSchema.parse(id));
  revalidatePath(POSTS_PATH);
}

export async function deletePost(id: string) {
  await requireSessionWithPermissions(["content.post.delete"]);
  await postService.delete(postIdSchema.parse(id));
  revalidatePath(POSTS_PATH);
}
