import Link from "next/link";
import { Building2, ChevronRight, Pencil, Users, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import {
  getOrganizationStats,
  getOrganizationTree,
} from "@/modules/organization";

const levelBadge: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  PP: { label: "PP", variant: "default" },
  PW: { label: "PW", variant: "secondary" },
  PC: { label: "PC", variant: "outline" },
};

export const dynamic = "force-dynamic";

export default async function PendataanPage() {
  const [tree, stats] = await Promise.all([
    getOrganizationTree(),
    getOrganizationStats(),
  ]);

  const renderUnit = (unit: (typeof tree)[number], depth: number) => {
    const badge = levelBadge[unit.level] ?? levelBadge.PC;
    const officerCount = stats.officerCountByUnit[unit.id] ?? 0;

    return (
      <div key={unit.id}>
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5 last:border-b-0 hover:bg-muted/40"
          style={{ paddingLeft: `${16 + depth * 28}px` }}
        >
          {depth > 0 && (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/40" />
          )}
          <Badge variant={badge.variant} className="h-5 shrink-0 px-2 font-mono text-[11px]">
            {unit.code}
          </Badge>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {unit.name}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {officerCount} pengurus
          </span>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href={`/admin/secretariat/pendataan/units/${unit.id}/officers`}>
              <UsersRound className="size-3.5" />
              Pengurus
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href={`/admin/secretariat/pendataan/units/${unit.id}/edit`}>
              <Pencil className="size-3.5" />
              Ubah
            </Link>
          </Button>
        </div>
        {unit.children.map((child) => renderUnit(child, depth + 1))}
      </div>
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Pendataan"
        description="Struktur kepengurusan LIM se-Indonesia: Pengurus Pusat, Wilayah, dan Cabang."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/secretariat/pendataan/units/new">
              <Building2 className="size-4" />
              Tambah Unit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SectionCard variant="glass" className="rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Pengurus Pusat</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.unitCount.PP}
          </p>
        </SectionCard>
        <SectionCard variant="glass" className="rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Pengurus Wilayah</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.unitCount.PW}
          </p>
        </SectionCard>
        <SectionCard variant="glass" className="rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Pengurus Cabang</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.unitCount.PC}
          </p>
        </SectionCard>
        <SectionCard variant="glass" className="rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Pengurus Terdata</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {stats.totalOfficers}
          </p>
        </SectionCard>
      </div>

      <SectionCard className="mt-4 rounded-lg">
        <div className="border-b px-4 py-3">
          <h2 className="text-base font-semibold">Struktur Organisasi</h2>
          <p className="text-xs text-muted-foreground">
            Kode unit ini dipakai sebagai kolom kedua nomor surat. Klik
            &quot;Pengurus&quot; untuk mendata pengurus unit tersebut.
          </p>
        </div>
        <div className="py-1">
          {tree.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
              <UsersRound className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Belum ada struktur organisasi. Tambahkan unit pertama.
              </p>
            </div>
          ) : (
            tree.map((unit) => renderUnit(unit, 0))
          )}
        </div>
      </SectionCard>
    </PageContainer>
  );
}
