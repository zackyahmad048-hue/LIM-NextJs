import { formatDateId } from "@/lib/format";
import Link from "next/link";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { ListRow } from "@/components/admin/shared/list-row";
import { StatStrip } from "@/components/admin/shared/stat-primitives";

import { falakService } from "@/modules/falak/application/service";
import { getUpcomingEclipses } from "@/modules/falak/queries/eclipse.query";
import { getAllPrayerTimes } from "@/modules/falak/queries/prayer-time.query";
import { DEFAULT_CITY } from "@/lib/cities";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  VERIFIED: "Terverifikasi",
  CONFIRMED: "Dikonfirmasi",
  ARCHIVED: "Diarsipkan",
};

const STATUS_TONE: Record<string, string> = {
  CONFIRMED: "text-primary",
  VERIFIED: "text-emerald-600",
  DRAFT: "text-amber-600",
  ARCHIVED: "text-admin-content-fg/50",
};

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

      <Band>
        <StatStrip
          items={[
            {
              key: "prayer",
              label: "Jadwal Shalat",
              value: prayerTimes.length.toString(),
              description: `Tercatat untuk ${DEFAULT_CITY.name}`,
            },
            {
              key: "rukyat",
              label: "Observasi Rukyat",
              value: recentRukyat.total.toString(),
              description: `${pendingVerifications} menunggu verifikasi`,
            },
            {
              key: "hisab",
              label: "Total Hisab",
              value: hisabResult.total.toString(),
              description: "Data perhitungan",
            },
            {
              key: "eclipse",
              label: "Eclipse Mendatang",
              value: eclipses.length.toString(),
              description: "Event astronomi",
            },
          ]}
        />
      </Band>

      <div className="grid gap-4 lg:grid-cols-2">
        <Band>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-admin-content-fg">
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
            <ul className="divide-y divide-admin-border/50">
              {rukyatData.slice(0, 5).map((r) => (
                <ListRow
                  key={r.id}
                  title={r.locationName}
                  description={formatDateId(r.observationDate)}
                  meta={
                    <span
                      className={`text-xs font-medium ${
                        STATUS_TONE[r.status] ?? "text-admin-content-fg/50"
                      }`}
                    >
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  }
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-admin-content-fg/60">
              Belum ada data observasi.
            </p>
          )}
        </Band>

        <Band>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-admin-content-fg">
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
            <ul className="divide-y divide-admin-border/50">
              {eclipses.slice(0, 5).map((e) => (
                <ListRow
                  key={e.id}
                  title={
                    e.eclipseType === "SOLAR"
                      ? "Gerhana Matahari"
                      : "Gerhana Bulan"
                  }
                  description={formatDateId(e.eclipseDate)}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-admin-content-fg/60">
              Tidak ada eclipse mendatang.
            </p>
          )}
        </Band>
      </div>
    </PageContainer>
  );
}