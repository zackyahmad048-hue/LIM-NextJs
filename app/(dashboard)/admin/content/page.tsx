import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";

import { getContentSummary } from "@/modules/cms/queries/content.query";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const { categoryCount, postCount, publishedPostCount } =
    await getContentSummary();

  return (
    <PageContainer>
      <PageHeader
        title="Konten"
        description="Pusat pengelolaan kategori, berita, dan halaman website."
      />

      <Band tint="konten">
        <StatStrip
          items={[
            { key: "category", label: "Kategori", value: categoryCount, description: "Aktif" },
            {
              key: "post",
              label: "Berita",
              value: postCount,
              description: `${publishedPostCount} published`,
            },
            { key: "page", label: "Halaman", value: 0, description: "Disiapkan" },
          ]}
        />
      </Band>
    </PageContainer>
  );
}