import { redirect } from "next/navigation";

import { getCategories } from "@/modules/cms/queries/category.query";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPostPage() {
  const categories = await getCategories();

  if (categories.length === 0) {
    redirect("/admin/content/categories");
  }

  return <PostForm mode="create" categories={categories} />;
}
