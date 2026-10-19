import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

import { Button } from "@/components/ui/button";
import { BIDANG } from "@/config/bidang";

export default async function BidangPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Bidang-Bidang"
        description="Kelola daftar bidang dan sub-bidang organisasi."
        actions={
          <Button variant="outline" size="sm" asChild>
            <a href="/profil/bidang" target="_blank" rel="noreferrer">
              Lihat halaman
            </a>
          </Button>
        }
      />

      <Band variant="plain" className="border-t-0 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BIDANG.map((bidang) => (
            <div
              key={bidang.slug}
              className="rounded-xl border border-admin-border bg-admin-card-bg p-5 transition-colors hover:border-primary/30"
            >
              <h2 className="text-base font-semibold text-admin-content-fg">
                {bidang.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {bidang.tagline}
              </p>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                {bidang.description.length > 120
                  ? `${bidang.description.slice(0, 120)}...`
                  : bidang.description}
              </p>
              <div className="mt-4 space-y-1.5">
                {bidang.points.map((point) => (
                  <p
                    key={point}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {point}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Band>
    </PageContainer>
  );
}