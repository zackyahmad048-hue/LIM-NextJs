import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatCard } from "@/components/admin/shared/stat-card";
import { getAllRukyat } from "@/modules/falak/queries/rukyat.query";
import {
  getUpcomingEclipses,
  getPastEclipses,
} from "@/modules/falak/queries/eclipse.query";
import { Eye, Eclipse, Clock, CheckCircle } from "lucide-react";

export default async function FalakReportsPage() {
  const [rukyatData, upcomingEclipses, pastEclipses] = await Promise.all([
    getAllRukyat(1000),
    getUpcomingEclipses(),
    getPastEclipses(100),
  ]);

  const totalVisible = rukyatData.filter((r) => r.result === "VISIBLE").length;
  const totalConfirmed = rukyatData.filter(
    (r) => r.status === "CONFIRMED",
  ).length;

  return (
    <PageContainer>
      <PageHeader
        title="Laporan Falak"
        description="Ringkasan dan statistik data falak."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Observasi"
          icon={Eye}
          value={rukyatData.length.toString()}
          description="Semua data rukyat"
        />
        <StatCard
          title="Hilal Terlihat"
          icon={CheckCircle}
          value={totalVisible.toString()}
          description={`${totalConfirmed} dikonfirmasi`}
        />
        <StatCard
          title="Eclipse Mendatang"
          icon={Eclipse}
          value={upcomingEclipses.length.toString()}
          description="Event akan datang"
        />
        <StatCard
          title="Eclipse Tercatat"
          icon={Clock}
          value={pastEclipses.length.toString()}
          description="Riwayat eclipse"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Band>
          <h3 className="font-semibold text-admin-content-fg">
            Statistik Hasil Rukyat
          </h3>
          <div className="mt-4 space-y-3">
            {(["VISIBLE", "NOT_VISIBLE", "CLOUDY", "UNKNOWN"] as const).map(
              (result) => {
                const count = rukyatData.filter(
                  (r) => r.result === result,
                ).length;
                const pct =
                  rukyatData.length > 0
                    ? ((count / rukyatData.length) * 100).toFixed(1)
                    : "0";
                const label =
                  result === "VISIBLE"
                    ? "Terlihat"
                    : result === "NOT_VISIBLE"
                      ? "Tidak Terlihat"
                      : result === "CLOUDY"
                        ? "Berawan"
                        : "Tidak Diketahui";
                return (
                  <div
                    key={result}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-admin-content-fg/60">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-admin-content-fg">
                        {count}
                      </span>
                      <span className="text-xs text-admin-content-fg/60">
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </Band>

        <Band>
          <h3 className="font-semibold text-admin-content-fg">
            Riwayat Eclipse
          </h3>
          {pastEclipses.length > 0 ? (
            <div className="mt-4 space-y-2">
              {pastEclipses.slice(0, 8).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-lg border border-admin-border px-3 py-2 text-sm"
                >
                  <span className="font-medium text-admin-content-fg">
                    {e.eclipseType === "SOLAR"
                      ? "Gerhana Matahari"
                      : "Gerhana Bulan"}
                  </span>
                  <span className="text-xs text-admin-content-fg/60">
                    {new Intl.DateTimeFormat("id-ID").format(e.eclipseDate)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-admin-content-fg/60">
              Belum ada riwayat eclipse.
            </p>
          )}
        </Band>
      </div>
    </PageContainer>
  );
}