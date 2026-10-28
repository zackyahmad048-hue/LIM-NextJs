import { formatDateId } from "@/lib/format";
import Link from "next/link";
import { Calendar, ClipboardList, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip, StatRow } from "@/components/admin/shared/stat-primitives";

import {
  getProgramStats,
  getUpcomingPrograms,
} from "@/modules/program/queries/program.query";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PUBLISHED: { label: "Dipublikasikan", variant: "default" },
  REGISTRATION_OPEN: { label: "Registrasi Dibuka", variant: "default" },
  REGISTRATION_CLOSED: { label: "Registrasi Ditutup", variant: "secondary" },
  ON_GOING: { label: "Berlangsung", variant: "default" },
  COMPLETED: { label: "Selesai", variant: "secondary" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

export default async function ProgramDashboardPage() {
  const [stats, upcoming] = await Promise.all([
    getProgramStats(),
    getUpcomingPrograms(5),
  ]);

  const statCards = [
    {
      label: "Total Program",
      value: stats.total,
    },
    {
      label: "Draft",
      value: stats.draft,
    },
    {
      label: "Dipublikasikan",
      value: stats.published,
    },
    {
      label: "Registrasi Dibuka",
      value: stats.registrationOpen,
    },
    {
      label: "Berlangsung",
      value: stats.onGoing,
    },
    {
      label: "Selesai",
      value: stats.completed,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Program"
        description="Ringkasan seluruh kegiatan dan program organisasi."
        actions={
          <Button asChild size="sm">
            <Link href="/admin/program/new">
              <Plus className="size-4" />
              Buat Program
            </Link>
          </Button>
        }
      />

      <Band variant="raised" tint="program">
        <StatStrip
          items={statCards.slice(0, 4).map((stat) => ({
            key: stat.label,
            label: stat.label,
            value: stat.value,
          }))}
        />
        <div className="mt-4 max-w-md">
          <StatRow
            items={statCards.slice(4).map((stat) => ({
              key: stat.label,
              label: stat.label,
              value: stat.value,
            }))}
          />
        </div>
      </Band>

      <div className="grid gap-4 lg:grid-cols-2">
        <Band
          variant="plain"
          title={
            <span className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              Program Mendatang
            </span>
          }
        >
          {upcoming.length > 0 ? (
            <ul className="mt-4 divide-y divide-admin-border/50">
              {upcoming.map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/admin/program/${program.id}/edit`}
                    className="group flex items-center justify-between gap-4 py-3 transition-colors hover:bg-admin-border/20 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-admin-content-fg group-hover:text-primary">
                        {program.name}
                      </p>
                      <p className="mt-0.5 text-xs text-admin-content-fg/80">
                        {formatDateId(program.startDate)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[11px]">
                      {statusLabels[program.status]?.label ?? program.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-admin-content-fg/60">
              Tidak ada program mendatang.
            </p>
          )}
        </Band>

        <Band
          variant="plain"
          title={
            <span className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              Akses Cepat
            </span>
          }
        >
          <div className="mt-4 space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/program/list">
                <ClipboardList className="size-4" />
                Daftar Program
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/program/new">
                <Plus className="size-4" />
                Buat Program Baru
              </Link>
            </Button>
          </div>
        </Band>
      </div>
    </PageContainer>
  );
}