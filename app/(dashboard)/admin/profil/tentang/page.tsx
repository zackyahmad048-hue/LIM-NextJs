import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";

import { getSitePageDefinition } from "@/config/site-pages";
import { getSitePageValues } from "@/modules/cms/queries/site-page.query";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { PageEditor } from "@/components/admin/page-editor";

export const dynamic = "force-dynamic";

export default async function TentangLimPage() {
  const def = getSitePageDefinition("page:tentang");
  const values = await getSitePageValues("page:tentang");

  return (
    <PageContainer>
      <PageHeader
        title={def?.title ?? "Tentang LIM"}
        description={def?.description ?? "Kelola konten halaman Tentang LIM."}
        actions={
          <>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/admin/profil">
                <ChevronLeft className="size-4" />
                Profil
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/profil/tentang" target="_blank" rel="noreferrer">
                Lihat halaman
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <PageEditor def={def!} initialValues={values} />
    </PageContainer>
  );
}