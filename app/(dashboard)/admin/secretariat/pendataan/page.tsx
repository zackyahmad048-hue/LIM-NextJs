import Link from "next/link";
import { Building2, ChevronRight, Pencil, Users, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";

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
          className="flex items-center gap-2 border-b py-2.5 last:border-b-0 hover:bg-admin-border/20"
          style={{ paddingLeft: `${depth * 28}px` }}
        >
          {depth > 0 && (
            <ChevronRight className="size-3.5 shrink-0 text-admin-content-fg/40" />
          )}
          <Badge variant={badge.variant} className="h-5 shrink-0 px-2 font-mono text-[11px]">
            {unit.code}
          </Badge>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {unit.name}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs text-admin-content-fg/60">
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

      <Band
        title="Struktur Organisasi"
        description="Kode unit dipakai sebagai kolom kedua nomor surat. Klik &quot;Pengurus&quot; untuk mendata pengurus unit tersebut."
      >
        <StatStrip
          items={[
            { label: "Pengurus Pusat", value: stats.unitCount.PP },
            { label: "Pengurus Wilayah", value: stats.unitCount.PW },
            { label: "Pengurus Cabang", value: stats.unitCount.PC },
            { label: "Pengurus Terdata", value: stats.totalOfficers },
          ]}
        />

        <div className="mt-5 border-t border-admin-border/60 pt-2">
          {tree.length === 0 ? (
            <div className="flex items-center gap-2 py-3 text-sm text-admin-content-fg/60">
              <UsersRound className="size-4 shrink-0" />
              Belum ada struktur organisasi. Tambahkan unit pertama.
            </div>
          ) : (
            tree.map((unit) => renderUnit(unit, 0))
          )}
        </div>
      </Band>
    </PageContainer>
  );
}