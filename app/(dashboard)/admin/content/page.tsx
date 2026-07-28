import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderTree,
  Newspaper,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { getContentSummary } from "@/modules/cms/queries/content.query";

const contentModules = [
  {
    title: "Kategori",
    description: "Kelola pengelompokan konten website.",
    href: "/admin/content/categories",
    icon: FolderTree,
  },
  {
    title: "Berita",
    description: "Pantau artikel, berita, dan pengumuman.",
    href: "/admin/content/posts",
    icon: Newspaper,
  },
  {
    title: "Halaman",
    description: "Siapkan halaman statis seperti profil dan visi misi.",
    href: "/admin/content/pages",
    icon: FileText,
  },
];

export default async function ContentPage() {
  const { categoryCount, postCount, publishedPostCount } =
    await getContentSummary();

  const summaries = [
    {
      label: "Kategori",
      value: categoryCount,
      caption: "Aktif",
    },
    {
      label: "Berita",
      value: postCount,
      caption: `${publishedPostCount} published`,
    },
    {
      label: "Halaman",
      value: 0,
      caption: "Disiapkan",
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Konten"
        description="Pusat pengelolaan kategori, berita, dan halaman website."
      />

      <div className="grid gap-3 md:grid-cols-3">
        {summaries.map((item) => (
          <SectionCard
            key={item.label}
            className="rounded-lg bg-background p-4 shadow-none"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.caption}
            </p>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {contentModules.map((item) => {
          const Icon = item.icon;

          return (
            <SectionCard
              key={item.href}
              className="rounded-lg bg-background p-4 shadow-none"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href={item.href}>
                  Buka
                  <ArrowUpRight />
                </Link>
              </Button>
            </SectionCard>
          );
        })}
      </div>
    </PageContainer>
  );
}
