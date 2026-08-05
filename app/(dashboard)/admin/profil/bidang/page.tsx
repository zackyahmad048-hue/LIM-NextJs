import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { Button } from "@/components/ui/button";
import { BIDANG } from "@/config/bidang";

export default async function BidangPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Bidang-Bidang"
        description="Kelola daftar bidang dan sub-bidang organisasi."
        actions={
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href="/profil/bidang" target="_blank" rel="noreferrer">
              Lihat halaman
            </a>
          </Button>
        }
      />

      <div className="rounded-lg border bg-background">
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {BIDANG.map((bidang) => (
            <div
              key={bidang.slug}
              className="rounded-xl border p-5 transition-colors hover:border-primary/30"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {bidang.title}
              </h3>
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
      </div>
    </PageContainer>
  );
}