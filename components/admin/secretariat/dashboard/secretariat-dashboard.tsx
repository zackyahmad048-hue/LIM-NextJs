import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  Inbox,
  Send,
  Settings2,
} from "lucide-react";

import { SectionCard } from "@/components/admin/shared/section-card";
import { StatCard } from "@/components/admin/shared/stat-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ActionQueue, type DashboardDisposition } from "./action-queue";
import { MonthlyTrendChart, type TrendDatum } from "./monthly-trend-chart";
import {
  RecentActivity,
  type RecentIncomingMail,
  type RecentOutgoingMail,
  type UpcomingAgenda,
} from "./recent-activity";
import { SystemHealth } from "./system-health";

interface DashboardStats {
  totalIncomingMails: number;
  totalOutgoingMails: number;
  pendingDispositions: number;
  totalAdministrativeDocuments: number;
  totalAgenda: number;
}

interface SecretariatDashboardProps {
  stats: DashboardStats;
  trend: {
    series: TrendDatum[];
    thisMonth: { incoming: number; outgoing: number };
    previousMonth: { incoming: number; outgoing: number };
  };
  queue: {
    dispositions: DashboardDisposition[];
    counts: {
      pendingDispositions: number;
      draftOutgoing: number;
      receivedIncoming: number;
      submittedDocuments: number;
    };
  };
  recent: {
    outgoing: RecentOutgoingMail[];
    incoming: RecentIncomingMail[];
    agendas: UpcomingAgenda[];
  };
  health: {
    driveEmail: string | null;
    missingAttachments: {
      outgoing: number;
      incoming: number;
      documents: number;
    };
  };
}

function percentDelta(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return "Tetap dari bulan lalu";
    return `+${current} dari bulan lalu`;
  }
  const diff = ((current - previous) / previous) * 100;
  const rounded = Math.round(diff);
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}% dari bulan lalu`;
}

const navCards: Array<{
  title: string;
  description: string;
  href: string;
  icon: typeof Inbox;
  tone: string;
}> = [
  {
    title: "Surat Keluar",
    description: "Buat, tandatangani, dan kirim surat keluar.",
    href: "/admin/secretariat/outgoing-mail/list",
    icon: Send,
    tone: "text-amber-600 bg-amber-100 dark:bg-amber-950/50",
  },
  {
    title: "Surat Masuk",
    description: "Catat surat masuk dan teruskan ke disposisi.",
    href: "/admin/secretariat/incoming-mail/list",
    icon: Inbox,
    tone: "text-sky-600 bg-sky-100 dark:bg-sky-950/50",
  },
  {
    title: "Disposisi",
    description: "Pantau instruksi dan tindak lanjut disposisi.",
    href: "/admin/secretariat/disposition/list",
    icon: ClipboardList,
    tone: "text-primary bg-primary/10",
  },
  {
    title: "Dokumen",
    description: "Kelola dokumen administrasi dan pengarsipan.",
    href: "/admin/secretariat/document/list",
    icon: FileText,
    tone: "text-violet-600 bg-violet-100 dark:bg-violet-950/50",
  },
];

export function SecretariatDashboard({
  stats,
  trend,
  queue,
  recent,
  health,
}: SecretariatDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <ActionQueue dispositions={queue.dispositions} counts={queue.counts} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Surat Masuk"
          value={stats.totalIncomingMails.toLocaleString("id-ID")}
          description={percentDelta(
            trend.thisMonth.incoming,
            trend.previousMonth.incoming,
          )}
          icon={Inbox}
        />
        <StatCard
          title="Surat Keluar"
          value={stats.totalOutgoingMails.toLocaleString("id-ID")}
          description={percentDelta(
            trend.thisMonth.outgoing,
            trend.previousMonth.outgoing,
          )}
          icon={Send}
        />
        <StatCard
          title="Disposisi Aktif"
          value={stats.pendingDispositions.toLocaleString("id-ID")}
          description="Menunggu atau sedang dikerjakan."
          icon={ClipboardList}
        />
        <StatCard
          title="Dokumen & Agenda"
          value={(
            stats.totalAdministrativeDocuments + stats.totalAgenda
          ).toLocaleString("id-ID")}
          description={`${stats.totalAdministrativeDocuments} dokumen · ${stats.totalAgenda} agenda`}
          icon={FileText}
        />
      </div>

      <SectionCard>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Tren 12 Bulan</h2>
            <p className="text-xs text-muted-foreground">
              Perbandingan surat masuk dan keluar bulanan.
            </p>
          </div>
          <div className="hidden gap-3 text-[11px] text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--chart-1)]" />
              Masuk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--chart-2)]" />
              Keluar
            </span>
          </div>
        </div>
        <div className="mt-4">
          <MonthlyTrendChart series={trend.series} />
        </div>
      </SectionCard>

      <RecentActivity
        outgoing={recent.outgoing}
        incoming={recent.incoming}
        agendas={recent.agendas}
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <SystemHealth
          driveEmail={health.driveEmail}
          missingAttachments={health.missingAttachments}
        />
        <SectionCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Modul Sekretariat</h2>
              <p className="text-xs text-muted-foreground">
                Pintasan cepat ke fitur utama.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              asChild
            >
              <Link href="/admin/secretariat/surat-menyurat">
                <Settings2 className="mr-1 size-3.5" />
                Pengaturan
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md",
                      card.tone,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{card.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
