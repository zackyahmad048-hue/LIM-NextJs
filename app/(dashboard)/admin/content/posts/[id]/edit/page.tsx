import { notFound } from "next/navigation";

import { findPostById } from "@/modules/cms/infrastructure/post.repository";
import { getCategories } from "@/modules/cms/queries/category.query";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    findPostById(id),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  const categoryId =
    typeof post.category === "number"
      ? String(post.category)
      : post.category
        ? String(post.category.id)
        : "";

  return (
    <PostForm
      mode="edit"
      postId={String(post.id)}
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        categoryId,
        thumbnail: post.thumbnail ?? "",
      }}
      categories={categories}
    />
  );
}
