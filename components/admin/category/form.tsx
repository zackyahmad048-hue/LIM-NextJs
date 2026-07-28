"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type { Category } from "@/generated/client";

import {
  createCategory,
  updateCategory,
} from "@/modules/cms/presentation/category.action";

import {
  categorySchema,
  type CategoryInput,
} from "@/modules/cms/validations/category.schema";

import { slugify } from "@/modules/shared/utils/slug";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  category?: Category;
  onSuccess(): void;
}

export function CategoryForm({ category, onSuccess }: Props) {
  const router = useRouter();

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
    });
  }, [category, form]);

  async function submit(values: CategoryInput) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("description", values.description ?? "");

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(
      category
        ? "Kategori berhasil diperbarui."
        : "Kategori berhasil ditambahkan."
    );

    router.refresh();
    form.reset();
    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>

        <Input
          id="name"
          // ✅ Fix: pakai register options onChange, bukan override
          {...form.register("name", {
            onChange: (e) => {
              form.setValue("slug", slugify(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              });
            },
          })}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>

        <Input
          id="slug"
          {...form.register("slug")}
        />

        {form.formState.errors.slug && (
          <p className="text-sm text-destructive">
            {form.formState.errors.slug.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>

        <Textarea
          id="description"
          rows={4}
          {...form.register("description")}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Batal
        </Button>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Menyimpan..."
            : category
            ? "Update"
            : "Simpan"}
        </Button>
      </div>
    </form>
  );
}