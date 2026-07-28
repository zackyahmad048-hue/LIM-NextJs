import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { getPublicMediaItems } from "@/modules/cms/queries/media.query";

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {mediaItems.map((item) => (
          <SectionCard
            key={item.href}
            className="overflow-hidden rounded-lg bg-background p-0 shadow-none"
          >
            <div className="relative aspect-4/3 bg-muted">
              <Image
                src={item.href}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.href}
                  </p>
                </div>
                <Badge variant="secondary" className="h-5 px-2 text-[11px]">
                  {item.size}
                </Badge>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {mediaItems.length === 0 && (
        <SectionCard className="rounded-lg bg-background p-8 text-center shadow-none">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold">Belum ada media</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Simpan gambar di folder public/images untuk menampilkannya di sini.
          </p>
        </SectionCard>
      )}
    </PageContainer>
  );
}
