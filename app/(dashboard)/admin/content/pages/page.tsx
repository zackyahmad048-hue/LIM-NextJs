import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { PageForm } from "@/components/admin/page-form";

import { getPages } from "@/modules/cms/queries/page.query";

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <PageContainer>
      <PageHeader
        title="Halaman"
        description="Kelola halaman statis untuk profil, visi misi, dan informasi lembaga."
      />

      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <PageForm
            key={page.key}
            pageKey={page.key}
            title={page.title}
            initialContent={page.content}
          />
        ))}
      </div>
    </PageContainer>
  );
}
