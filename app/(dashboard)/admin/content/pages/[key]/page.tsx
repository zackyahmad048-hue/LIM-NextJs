import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronLeft } from "lucide-react";

import { getSitePageDefinition } from "@/config/site-pages";
import { getSitePageValues } from "@/modules/cms/queries/site-page.query";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { PageEditor } from "@/components/admin/page-editor";

export const dynamic = "force-dynamic";

export default async function EditSitePagePage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const def = getSitePageDefinition(key);

  if (!def) {
    notFound();
  }

  const values = await getSitePageValues(key);

  return (
    <PageContainer>
      <PageHeader
        title={def.title}
        description={def.description}
        actions={
          <>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/admin/content/pages">
                <ChevronLeft className="size-4" />
                Peta situs
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href={def.route} target="_blank" rel="noreferrer">
                Lihat halaman
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <PageEditor def={def} initialValues={values} />
    </PageContainer>
  );
}