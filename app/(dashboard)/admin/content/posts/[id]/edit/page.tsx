import { notFound } from "next/navigation";

import { prisma } from "@/modules/shared/infrastructure/prisma";
import { getCategories } from "@/modules/cms/queries/category.query";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      mode="edit"
      postId={post.id}
      initialData={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        categoryId: post.categoryId,
        thumbnail: post.thumbnail ?? "",
      }}
      categories={categories}
    />
  );
}
