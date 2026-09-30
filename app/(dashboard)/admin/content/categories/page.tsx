import { getCategories } from "@/modules/cms/queries/category.query";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { CategoryModule } from "@/components/admin/category";

export default async function Page() {
  const categories = await getCategories();

  return (
    <PageContainer>
      <PageHeader
        title="Kategori"
        description="Kelola pengelompokan konten untuk berita dan halaman website."
      />
      <CategoryModule data={categories} />
    </PageContainer>
  );
}
