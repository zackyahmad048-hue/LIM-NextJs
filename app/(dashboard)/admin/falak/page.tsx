import { formatDateId } from "@/lib/format";
import Link from "next/link";
import {
  Clock,
  Calculator,
  Eye,
  Eclipse,
  FileBarChart,
  Archive,
  ChevronRight,
} from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatCard } from "@/components/admin/shared/stat-card";

import { falakService } from "@/modules/falak/application/service";
import { getUpcomingEclipses } from "@/modules/falak/queries/eclipse.query";
import { getAllPrayerTimes } from "@/modules/falak/queries/prayer-time.query";
import { DEFAULT_CITY } from "@/lib/cities";

const QUICK_LINKS = [
  {
    title: "Jadwal Shalat",
    description: "Kelola data waktu shalat",
    href: "/admin/falak/prayer-time",
    icon: Clock,
  },
  {
    title: "Hisab",
    description: "Data perhitungan hisab",
    href: "/admin/falak/hisab",
    icon: Calculator,
  },
  {
    title: "Rukyat",
    description: "Observasi hilal dan rukyat",
    href: "/admin/falak/rukyat",
    icon: Eye,
  },
  {
    title: "Eclipse",
    description: "Gerhana matahari dan bulan",
    href: "/admin/falak/eclipse",
    icon: Eclipse,
  },
  {
    title: "Laporan",
    description: "Ringkasan statistik falak",
    href: "/admin/falak/reports",
    icon: FileBarChart,
  },
  {
    title: "Arsip",
    description: "Data yang telah diarsipkan",
    href: "/admin/falak/archive",
    icon: Archive,
  },
];

export default async function FalakDashboardPage() {
  const [prayerTimes, hisabResult, recentRukyat, rukyatPending, eclipses] =
    await Promise.all([
      getAllPrayerTimes(
        DEFAULT_CITY.latitude,
        DEFAULT_CITY.longitude,
        "KEMENAG",
      ),
      falakService.getHisabPaginated(1, 1),
      falakService.getRukyatPaginated(1, 5),
      falakService.getRukyatPaginated(1, 1, undefined, "DRAFT"),
      getUpcomingEclipses(),
    ]);

  const rukyatData = recentRukyat.items;
  const pendingVerifications = rukyatPending.total;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Falak"
        description="Ringkasan data layanan falak."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jadwal Shalat"
          icon={Clock}
          value={prayerTimes.length.toString()}
          description={`Tercatat untuk ${DEFAULT_CITY.name}`}
        />
        <StatCard
          title="Observasi Rukyat"
          icon={Eye}
          value={recentRukyat.total.toString()}
          description={`${pendingVerifications} menunggu verifikasi`}
        />
        <StatCard
          title="Total Hisab"
          icon={Calculator}
          value={hisabResult.total.toString()}
          description="Data perhitungan"
        />
        <StatCard
          title="Eclipse Mendatang"
          icon={Eclipse}
          value={eclipses.length.toString()}
          description="Event astronomi"
        />
      </div>

      <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold">Menu Falak</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Kelola data layanan falak dari halaman berikut.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{link.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {link.description}
                  </p>
                </div>

                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard variant="glass" className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Observasi Rukyat Terbaru
            </h3>
            <Link
              href="/admin/falak/rukyat"
              className="text-xs text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {rukyatData.length > 0 ? (
            <div className="mt-4 space-y-2">
              {rukyatData.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{r.locationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateId(r.observationDate)}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      r.status === "CONFIRMED"
                        ? "text-primary"
                        : r.status === "VERIFIED"
                          ? "text-emerald-600"
                          : r.status === "DRAFT"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                    }`}
                  >
                    {r.status === "DRAFT"
                      ? "Draft"
                      : r.status === "VERIFIED"
                        ? "Terverifikasi"
                        : r.status === "CONFIRMED"
                          ? "Dikonfirmasi"
                          : "Diarsipkan"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Belum ada data observasi.
            </p>
          )}
        </SectionCard>

        <SectionCard variant="glass" className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Eclipse Mendatang
            </h3>
            <Link
              href="/admin/falak/eclipse"
              className="text-xs text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {eclipses.length > 0 ? (
            <div className="mt-4 space-y-2">
              {eclipses.slice(0, 5).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {e.eclipseType === "SOLAR"
                        ? "Gerhana Matahari"
                        : "Gerhana Bulan"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateId(e.eclipseDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Tidak ada eclipse mendatang.
            </p>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  );
}
