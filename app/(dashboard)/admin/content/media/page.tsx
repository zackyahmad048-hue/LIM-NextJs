import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { getPublicMediaItems } from "@/modules/cms/queries/media.query";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const mediaItems = await getPublicMediaItems();

  return (
    <PageContainer>
      <PageHeader
        title="Media"
        description="Kelola dan pantau aset gambar yang digunakan pada website."
        actions={
          <Button size="sm" disabled>
            <Upload className="size-4" />
            Upload media
          </Button>
        }
      />

      {mediaItems.length === 0 ? (
        <Band className="text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-admin-input-bg text-admin-content-fg/50">
            <ImageIcon className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-admin-content-fg">
            Belum ada media
          </h2>
          <p className="mt-1 text-xs text-admin-content-fg/60">
            Simpan gambar di folder public/images untuk menampilkannya di sini.
          </p>
        </Band>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mediaItems.map((item) => (
            <figure
              key={item.href}
              className="overflow-hidden rounded-xl border border-admin-border bg-admin-card-bg"
            >
              <div className="relative aspect-4/3 bg-admin-input-bg">
                <Image
                  src={item.href}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 truncate text-xs text-admin-content-fg/60">
                      {item.href}
                    </p>
                  </div>
                  <Badge variant="secondary" className="h-5 px-2 text-[11px]">
                    {item.size}
                  </Badge>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </PageContainer>
  );
}