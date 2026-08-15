import Link from "next/link";
import { Calendar, ClipboardList, FileText, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { cn } from "@/lib/utils";

import {
  getProgramStats,
  getUpcomingPrograms,
} from "@/modules/program/queries/program.query";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

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
      color: "text-primary bg-primary/10",
    },
    {
      label: "Draft",
      value: stats.draft,
      color: "text-stone-500 bg-stone-100 dark:bg-stone-800/60",
    },
    {
      label: "Published",
      value: stats.published,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
    },
    {
      label: "Registrasi Dibuka",
      value: stats.registrationOpen,
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40",
    },
    {
      label: "Berlangsung",
      value: stats.onGoing,
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/40",
    },
    {
      label: "Selesai",
      value: stats.completed,
      color: "text-orange-800 bg-orange-200 dark:bg-orange-950/60",
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const Icon = stat.value > 0 ? ClipboardList : FileText;
          return (
            <SectionCard
              key={stat.label}
              variant="glass"
              className="rounded-lg p-4 shadow-none"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div
                  className={cn("flex size-8 items-center justify-center rounded-lg", stat.color)}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {stat.value}
              </p>
            </SectionCard>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
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
                      {formatDate(program.startDate)}
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
        </SectionCard>

        <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
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
        </SectionCard>
      </div>
    </PageContainer>
  );
}
