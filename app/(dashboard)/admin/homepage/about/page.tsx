import { Save } from "lucide-react";

import { aboutData } from "@/data/about";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { updateAbout } from "./actions";

export default async function AboutSettingsPage() {
  return (
    <PageContainer className="gap-4 p-4 lg:p-5">
      <PageHeader
        title="Tentang Kami"
        description="Kelola konten section About pada landing page."
      />

      <form action={updateAbout} className="space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Umum</h2>
            <p className="text-xs text-muted-foreground">
              Badge, judul, dan deskripsi utama section About.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="badge" className="text-xs">
                Badge label
              </Label>
              <Input
                id="badge"
                name="badge"
                defaultValue={aboutData.badge}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image" className="text-xs">
                Path gambar
              </Label>
              <Input
                id="image"
                name="image"
                defaultValue={aboutData.image}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title" className="text-xs">
                Judul
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={aboutData.title}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subtitle" className="text-xs">
                Subtitle
              </Label>
              <Input
                id="subtitle"
                name="subtitle"
                defaultValue={aboutData.subtitle}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description" className="text-xs">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={aboutData.description}
                className="min-h-24 rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Fitur</h2>
            <p className="text-xs text-muted-foreground">
              Card fitur yang ditampilkan di section About.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {aboutData.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-md border bg-muted/30 p-3"
              >
                <input
                  type="hidden"
                  name={`features.${index}.title`}
                  defaultValue={feature.title}
                />
                <input
                  type="hidden"
                  name={`features.${index}.description`}
                  defaultValue={feature.description}
                />
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Fitur saat ini bersifat read-only. Edit langsung di{' '}
            <code className="rounded bg-muted px-1 py-0.5">data/about.ts</code>.
          </p>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Save className="size-4" />
            Simpan About
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
