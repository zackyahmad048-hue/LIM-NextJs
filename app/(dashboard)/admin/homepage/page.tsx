import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, PenLine } from "lucide-react";

import {
  getHomepageSectionStatuses,
  type HomepageSectionStatus,
} from "@/modules/cms/queries/homepage.query";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { cn } from "@/lib/utils";

function formatUpdatedAt(date: Date | null): string | null {
  if (!date) return null;

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SectionRow({ section }: { section: HomepageSectionStatus }) {
  const updated = formatUpdatedAt(section.updatedAt);

  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {section.settingKey}
          </span>

          {section.stored && updated ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Tersimpan · {updated}
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              Konten bawaan kode
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-semibold">{section.title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {section.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          asChild
        >
          <Link
            href={section.previewHref}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowUpRight className="size-4" />
            Lihat
          </Link>
        </Button>

        <Button
          size="sm"
          variant={section.stored ? "default" : "outline"}
          className="rounded-full"
          asChild
        >
          <Link href={section.adminHref}>
            <PenLine className="size-4" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function HomepageGovernancePage() {
  const sections = await getHomepageSectionStatuses();

  return (
    <PageContainer>
      <PageHeader
        title="Tata Kelola Beranda"
        description="Semua section pada halaman utama, sumber datanya, dan status pengisiannya. Setiap section dapat diedit lewat CMS tanpa menyentuh kode."
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3 px-1">
          <span className="text-sm font-semibold uppercase text-foreground">
            Section Beranda
          </span>
          <span className="text-xs text-muted-foreground">
            Urutan sesuai tampilan pada halaman /
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-primary/25 bg-admin-card-bg shadow-sm">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={cn(index > 0 && "border-t border-border/60")}
            >
              <SectionRow section={section} />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-primary/25 bg-admin-card-bg shadow-sm">
          <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Cara kerja</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                Jika status ditandai “Konten bawaan kode”, section masih memakai
                nilai default dari kode. Begitu Anda menyimpan lewat editor,
                nilai akan tersimpan sebagai pengaturan dan menimpa bawaan kode.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full shrink-0"
              asChild
            >
              <Link href="/" target="_blank" rel="noreferrer">
                <LayoutDashboard className="size-4" />
                Buka situs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}