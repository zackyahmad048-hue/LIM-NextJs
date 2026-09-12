import { BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";
import { ReportingSyncButton } from "@/components/admin/reporting-sync-button";

import { prisma } from "@/modules/shared/infrastructure/prisma";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalCategories,
    totalUsers,
    postsByCategory,
  ] = await Promise.all([
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { published: true, deletedAt: null } }),
    prisma.post.count({
      where: { published: false, publishedAt: null, deletedAt: null },
    }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.user.count(),
    prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        _count: { select: { posts: { where: { deletedAt: null } } } },
      },
      orderBy: { posts: { _count: "desc" } },
    }),
  ]);

  const { permissionSlugs } = await getCurrentUserPermissions();
  const canSync = permissionSlugs.includes("reports.sync");

  const archivedPosts = totalPosts - publishedPosts - draftPosts;
  const publishedRate =
    totalPosts > 0 ? `${Math.round((publishedPosts / totalPosts) * 100)}%` : "0%";

  return (
    <PageContainer>
      <PageHeader
        title="Laporan"
        description="Ringkasan data dan statistik konten website."
      />

      <Band tint="sistem">
        <StatStrip
          items={[
            {
              key: "posts",
              label: "Total Berita",
              value: totalPosts,
              description: `${publishedPosts} published`,
            },
            { key: "categories", label: "Kategori", value: totalCategories, description: "Aktif" },
            { key: "users", label: "Pengguna", value: totalUsers, description: "Terdaftar" },
            {
              key: "rate",
              label: "Published Rate",
              value: publishedRate,
              description: `${publishedPosts} dari ${totalPosts}`,
            },
          ]}
        />
      </Band>

      <Band>
        <div className="flex items-center gap-2">
          <BarChart3 className="size-4 text-admin-content-fg/50" />
          <h2 className="text-base font-semibold text-admin-content-fg">
            Status berita
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Published",
              value: publishedPosts,
              variant: "default" as const,
            },
            { label: "Draft", value: draftPosts, variant: "outline" as const },
            {
              label: "Archived",
              value: archivedPosts,
              variant: "secondary" as const,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-admin-border bg-admin-card-bg p-4 text-center"
            >
              <p className="text-3xl font-bold tabular-nums text-admin-content-fg">
                {item.value}
              </p>
              <Badge variant={item.variant} className="mt-2">
                {item.label}
              </Badge>
            </div>
          ))}
        </div>
      </Band>

      <Band>
        <h2 className="text-base font-semibold text-admin-content-fg">
          Berita per kategori
        </h2>
        <p className="mt-1 text-xs text-admin-content-fg/60">
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
                  <div className="min-w-30 text-sm font-medium text-admin-content-fg">
                    {cat.name}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-admin-input-bg">
                      <div
                        className="h-full rounded-full bg-admin-content-fg/80"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-admin-content-fg/60">
                    {count} ({percentage}%)
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-admin-content-fg/60">Belum ada kategori.</p>
          )}
        </div>
      </Band>

      {canSync && (
        <Band>
          <ReportingSyncButton />
        </Band>
      )}
    </PageContainer>
  );
}