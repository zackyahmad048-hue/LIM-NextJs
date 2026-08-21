
import { Save } from "lucide-react";

import { DEFAULT_HERO_CONFIG } from "@/config/hero";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionForm } from "@/components/admin/shared/action-form";
import { ImagePathField } from "@/components/admin/shared/image-path-field";

import { updateHeroConfig } from "./actions";

export default async function HeroSettingsPage() {
  const saved = await getHeroConfig();
  const config = { ...DEFAULT_HERO_CONFIG, ...saved };

  return (
    <PageContainer className="gap-4 p-4 lg:p-5">
      <PageHeader
        title="Hero Section"
        description="Kelola teks, gambar, dan tombol pada hero landing page."
      />

      <ActionForm action={updateHeroConfig} submitLabel="Simpan hero" submitIcon={<Save className="size-4" />}>
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Konten Teks</h2>
            <p className="text-xs text-muted-foreground">
              Judul, deskripsi, dan tombolCTA pada hero.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="eyebrow" className="text-xs">
                Label kecil (eyebrow)
              </Label>
              <Input
                id="eyebrow"
                name="eyebrow"
                defaultValue={config.eyebrow}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <ImagePathField defaultValue={config.image} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs">
                Judul utama
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={config.title}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="highlight" className="text-xs">
                Highlight / subjudul
              </Label>
              <Input
                id="highlight"
                name="highlight"
                defaultValue={config.highlight}
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
                defaultValue={config.description}
                className="min-h-20 rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Tombol (CTA)</h2>
            <p className="text-xs text-muted-foreground">
              Tombol utama dan tombol kedua pada hero.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ctaLabel" className="text-xs">
                Tombol utama (label)
              </Label>
              <Input
                id="ctaLabel"
                name="ctaLabel"
                defaultValue={config.ctaLabel}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ctaHref" className="text-xs">
                Tombol utama (link)
              </Label>
              <Input
                id="ctaHref"
                name="ctaHref"
                defaultValue={config.ctaHref}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secondaryLabel" className="text-xs">
                Tombol kedua (label)
              </Label>
              <Input
                id="secondaryLabel"
                name="secondaryLabel"
                defaultValue={config.secondaryLabel}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secondaryHref" className="text-xs">
                Tombol kedua (link)
              </Label>
              <Input
                id="secondaryHref"
                name="secondaryHref"
                defaultValue={config.secondaryHref}
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Kartu Statistik</h2>
            <p className="text-xs text-muted-foreground">
              Angka penting yang ditampilkan di bawah hero.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => {
              const stat = config.statCards?.[i - 1];
              return (
                <div key={i} className="space-y-2">
                  <Label className="text-xs">Statistik {i}</Label>
                  <Input
                    name={`stat${i}Value`}
                    defaultValue={stat?.value ?? ""}
                    placeholder="angka (mis. 100+)"
                    className="rounded-md text-xs"
                  />
                  <Input
                    name={`stat${i}Label`}
                    defaultValue={stat?.label ?? ""}
                    placeholder="label (mis. Wilayah dan cabang)"
                    className="rounded-md text-xs"
                  />
                </div>
              );
            })}
          </div>
        </SectionCard>

      </ActionForm>
    </PageContainer>
  );
}
