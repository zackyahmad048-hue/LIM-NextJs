"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/modules/shared/infrastructure/require-session";

const ABOUT_PATH = "/admin/homepage/about";

export async function updateAbout(formData: FormData) {
  await requireSession();

  const data = {
    badge: String(formData.get("badge") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
  };

  // TODO: Save to database via settings repository
  void data;

  revalidatePath(ABOUT_PATH);
  revalidatePath("/");
}
