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
  PUBLISHED: { label: "Published", variant: "default" },
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
      label: "Published",
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
        <Band variant="plain">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Program Mendatang</h2>
          </div>
          {upcoming.length > 0 ? (
            <div className="mt-4 space-y-2">
              {upcoming.map((program) => (
                <Link
                  key={program.id}
                  href={`/admin/program/${program.id}/edit`}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateId(program.startDate)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    {statusLabels[program.status]?.label ?? program.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Tidak ada program mendatang.
            </p>
          )}
        </Band>

        <Band variant="plain">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Akses Cepat</h2>
          </div>
          <div className="mt-4 space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/program/list">
                <ClipboardList className="mr-2 size-4" />
                Daftar Program
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/program/new">
                <Plus className="mr-2 size-4" />
                Buat Program Baru
              </Link>
            </Button>
          </div>
        </Band>
      </div>
    </PageContainer>
  );
}