import {
  FolderTree,
  Newspaper,
  Users,
  BarChart3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { prisma } from "@/modules/shared/infrastructure/prisma";

export default async function ReportsPage() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalCategories,
    totalUsers,
    postsByCategory,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false, publishedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.user.count(),
    prisma.category.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
    }),
  ]);

  const archivedPosts = totalPosts - publishedPosts - draftPosts;

  return (
    <PageContainer>
      <PageHeader
        title="Laporan"
        description="Ringkasan data dan statistik konten website."
      />

      {/* Overview stats */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Berita",
            value: totalPosts,
            detail: `${publishedPosts} published`,
            icon: Newspaper,
            color: "text-blue-600 bg-blue-100",
          },
          {
            label: "Kategori",
            value: totalCategories,
            detail: "Aktif",
            icon: FolderTree,
            color: "text-emerald-600 bg-emerald-100",
          },
          {
            label: "Pengguna",
            value: totalUsers,
            detail: "Terdaftar",
            icon: Users,
            color: "text-violet-600 bg-violet-100",
          },
          {
            label: "Published Rate",
            value:
              totalPosts > 0
                ? `${Math.round((publishedPosts / totalPosts) * 100)}%`
                : "0%",
            detail: `${publishedPosts} dari ${totalPosts}`,
            icon: BarChart3,
            color: "text-amber-600 bg-amber-100",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <SectionCard
              key={stat.label}
              className="rounded-lg bg-background p-4 shadow-none"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div
                  className={`flex size-8 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </SectionCard>
          );
        })}
      </div>

      {/* Status breakdown */}
      <SectionCard className="rounded-lg bg-background p-4 shadow-none">
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Status berita</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Published", value: publishedPosts, variant: "default" as const },
            { label: "Draft", value: draftPosts, variant: "outline" as const },
            { label: "Archived", value: archivedPosts, variant: "secondary" as const },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-md border bg-muted/30 p-4 text-center"
            >
              <p className="text-3xl font-bold">{item.value}</p>
              <Badge variant={item.variant} className="mt-2">
                {item.label}
              </Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Posts per category */}
      <SectionCard className="rounded-lg bg-background p-4 shadow-none">
        <h2 className="text-base font-semibold">Berita per kategori</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Jumlah berita di setiap kategori.
        </p>

        <div className="mt-4 space-y-2">
          {postsByCategory.length > 0 ? (
            postsByCategory.map((cat) => {
              const count = cat._count.posts;
              const percentage =
                totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;

              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="min-w-[120px] text-sm font-medium">
                    {cat.name}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-muted-foreground">
                    {count} ({percentage}%)
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada kategori.
            </p>
          )}
        </div>
      </SectionCard>
    </PageContainer>
  );
}
