import Link from "next/link";
import { ArrowRight, Settings2 } from "lucide-react";

import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";
import { ListRow } from "@/components/admin/shared/list-row";
import { Button } from "@/components/ui/button";

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

const navLinks: Array<{
  title: string;
  description: string;
  href: string;
}> = [
  {
    title: "Surat Keluar",
    description: "Buat, tandatangani, dan kirim surat keluar.",
    href: "/admin/secretariat/outgoing-mail/list",
  },
  {
    title: "Surat Masuk",
    description: "Catat surat masuk dan teruskan ke disposisi.",
    href: "/admin/secretariat/incoming-mail/list",
  },
  {
    title: "Disposisi",
    description: "Pantau instruksi dan tindak lanjut disposisi.",
    href: "/admin/secretariat/disposition/list",
  },
  {
    title: "Dokumen",
    description: "Kelola dokumen administrasi dan pengarsipan.",
    href: "/admin/secretariat/document/list",
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

      <Band>
        <StatStrip
          items={[
            {
              key: "incoming",
              label: "Surat Masuk",
              value: stats.totalIncomingMails.toLocaleString("id-ID"),
              description: percentDelta(
                trend.thisMonth.incoming,
                trend.previousMonth.incoming,
              ),
            },
            {
              key: "outgoing",
              label: "Surat Keluar",
              value: stats.totalOutgoingMails.toLocaleString("id-ID"),
              description: percentDelta(
                trend.thisMonth.outgoing,
                trend.previousMonth.outgoing,
              ),
            },
            {
              key: "dispositions",
              label: "Disposisi Aktif",
              value: stats.pendingDispositions.toLocaleString("id-ID"),
              description: "Menunggu atau sedang dikerjakan.",
            },
            {
              key: "documents",
              label: "Dokumen & Agenda",
              value: (
                stats.totalAdministrativeDocuments + stats.totalAgenda
              ).toLocaleString("id-ID"),
              description: `${stats.totalAdministrativeDocuments} dokumen · ${stats.totalAgenda} agenda`,
            },
          ]}
        />
      </Band>

      <Band>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Tren 12 Bulan</h2>
            <p className="text-xs text-admin-content-fg/60">
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
      </Band>

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
        <Band className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Modul Sekretariat</h2>
              <p className="text-xs text-admin-content-fg/60">
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
          <div className="mt-4">
            <ul className="divide-y divide-admin-border/50">
              {navLinks.map((link) => (
                <ListRow
                  key={link.href}
                  title={link.title}
                  description={link.description}
                  action={
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      aria-label={`Buka ${link.title}`}
                    >
                      <Link href={link.href}>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  }
                />
              ))}
            </ul>
          </div>
        </Band>
      </div>
    </div>
  );
}
