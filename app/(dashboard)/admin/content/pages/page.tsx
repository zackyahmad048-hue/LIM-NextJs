import Link from "next/link";
import { ArrowUpRight, ExternalLink, PenLine } from "lucide-react";

import {
  SITE_PAGE_AREAS,
  getSitePageDefinition,
  type SitePageArea,
} from "@/config/site-pages";
import {
  getSitePageStatuses,
} from "@/modules/cms/queries/site-page.query";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { cn } from "@/lib/utils";

interface ModuleLink {
  route: string;
  title: string;
  description: string;
  adminHref: string;
}

const MODULE_LINKS: Record<SitePageArea, ModuleLink[]> = {
  beranda: [
    {
      route: "/",
      title: "Hero Landing",
      description:
        "Label, judul, tombol ajakan, dan kartu statistik pada halaman muka.",
      adminHref: "/admin/homepage/hero",
    },
    {
      route: "/artikel",
      title: "Berita & Artikel",
      description: "Daftar berita, artikel, dan pengumuman terbit.",
      adminHref: "/admin/content/posts",
    },
  ],
  profil: [
    {
      route: "/profil/pengurus-pusat",
      title: "Pengurus Pusat",
      description: "Struktur dan jajaran pengurus lembaga.",
      adminHref: "/admin/profil/pengurus-pusat",
    },
    {
      route: "/profil/bidang",
      title: "Bidang & Tim Wajib Khidmah",
      description: "Profil tiap bidang organisasi dan TWK.",
      adminHref: "/admin/profil/bidang",
    },
  ],
  layanan: [
    {
      route: "/media",
      title: "Galeri & Dokumentasi",
      description: "Kumpulan foto dan video kegiatan.",
      adminHref: "/admin/content/media",
    },
  ],
};

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

interface RowProps {
  route: string;
  title: string;
  description: string;
  updated: string | null;
  href: string;
}

function PageRow({ route, title, description, updated, href }: RowProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {route}
          </span>

          {updated ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Tersimpan · {updated}
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              Konten bawaan
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        <Button
          size="sm"
          variant={updated ? "default" : "outline"}
          className="rounded-full"
          asChild
        >
          <Link href={href}>
            <PenLine className="size-4" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ModuleRow({ row }: { row: ModuleLink }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {row.route}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            <ExternalLink className="size-3" />
            Dikelola di modul terkait
          </span>
        </div>

        <p className="mt-1 text-sm font-semibold">{row.title}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {row.description}
        </p>
      </div>

      <div className="shrink-0">
        <Button size="sm" variant="outline" className="rounded-full" asChild>
          <Link href={row.adminHref}>
            Kelola
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default async function SitePagesPage() {
  const statuses = await getSitePageStatuses();

  const areas: SitePageArea[] = ["beranda", "profil", "layanan"];

  return (
    <PageContainer>
      <PageHeader
        title="Peta Situs"
        description="Seluruh halaman website dan status kontennya. Pilih halaman untuk mengedit, atau kelola lewat modul terkait."
      />

      <div className="flex flex-col gap-6">
        {areas.map((area) => {
          const pages = statuses.filter(
            (status) =>
              getSitePageDefinition(status.key)?.area === area,
          );
          const modules = MODULE_LINKS[area];

          return (
            <section key={area} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3 px-1">
                <span className="text-sm font-semibold uppercase text-foreground">
                  {SITE_PAGE_AREAS[area].label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {SITE_PAGE_AREAS[area].description}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {pages.map((page, index) => (
                  <div
                    key={page.key}
                    className={cn(
                      index > 0 && "border-t border-border/60",
                    )}
                  >
                    <PageRow
                      route={page.route}
                      title={page.title}
                      description={getSitePageDefinition(page.key)!.description}
                      updated={formatUpdatedAt(page.updatedAt)}
                      href={`/admin/content/pages/${page.key}`}
                    />
                  </div>
                ))}

                {modules.map((row) => (
                  <div
                    key={row.route}
                    className={cn(
                      "border-t border-border/60",
                    )}
                  >
                    <ModuleRow row={row} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}