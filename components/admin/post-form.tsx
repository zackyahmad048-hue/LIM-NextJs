"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

import type { Category } from "@/generated/client";
import {
  postSchema,
  type PostInput,
} from "@/modules/cms/validations/post.schema";
import { slugify } from "@/modules/shared/utils/slug";
import { createPost, updatePost } from "@/modules/cms/presentation/post.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categoryId: string;
    thumbnail: string;
  };
  categories: Category[];
}

export function PostForm({
  mode,
  postId,
  initialData,
  categories,
}: PostFormProps) {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialData?.categoryId ?? "",
  );

  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      categoryId: initialData?.categoryId ?? "",
      thumbnail: initialData?.thumbnail ?? "",
    },
  });

  useEffect(() => {
    form.setValue("categoryId", selectedCategoryId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedCategoryId, form]);

  async function submit(values: PostInput) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("excerpt", values.excerpt ?? "");
    formData.append("content", values.content);
    formData.append("categoryId", values.categoryId);
    formData.append("thumbnail", values.thumbnail ?? "");

    const result =
      mode === "create"
        ? await createPost(formData)
        : await updatePost(postId!, formData);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      mode === "create"
        ? "Berita berhasil dibuat."
        : "Berita berhasil diperbarui.",
    );
    router.push("/admin/content/posts");
    router.refresh();
  }

  return (
    <PageContainer className="gap-4 bg-muted/20 p-4 lg:p-5">
      <PageHeader
        title={mode === "create" ? "Tulis Berita" : "Edit Berita"}
        description={
          mode === "create"
            ? "Buat artikel, berita, atau pengumuman baru."
            : "Perbarui konten berita."
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/content/posts">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      <form
        onSubmit={form.handleSubmit(submit)}
        className="grid gap-4 xl:grid-cols-[1fr_320px]"
      >
        {/* Main content */}
        <div className="flex flex-col gap-4">
          <SectionCard className="rounded-lg bg-background p-4 shadow-none">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  placeholder="Judul berita..."
                  {...form.register("title", {
                    onChange: (e) => {
                      if (mode === "create") {
                        form.setValue("slug", slugify(e.target.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="slug-berita"
                  {...form.register("slug")}
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  placeholder="Ringkasan singkat (opsional)..."
                  {...form.register("excerpt")}
                />
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.excerpt.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  rows={12}
                  placeholder="Tulis konten berita di sini..."
                  className="font-mono text-sm"
                  {...form.register("content")}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <SectionCard className="rounded-lg bg-background p-4 shadow-none">
            <h3 className="text-sm font-semibold">Publikasi</h3>
            <div className="mt-3 space-y-3">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="/images/thumbnail.jpg"
                  {...form.register("thumbnail")}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="rounded-lg bg-background p-4 shadow-none">
            <h3 className="text-sm font-semibold">Aksi</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  "Menyimpan..."
                ) : mode === "create" ? (
                  <>
                    <Save className="size-4" />
                    Simpan Draft
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Perbarui
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/content/posts")}
              >
                Batal
              </Button>
            </div>
          </SectionCard>
        </div>
      </form>
    </PageContainer>
  );
}
