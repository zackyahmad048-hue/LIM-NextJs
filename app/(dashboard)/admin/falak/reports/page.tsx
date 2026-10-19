import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";
import { getAllRukyat } from "@/modules/falak/queries/rukyat.query";
import {
  getUpcomingEclipses,
  getPastEclipses,
} from "@/modules/falak/queries/eclipse.query";

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

      <Band variant="plain" className="border-t-0 pt-0">
        <StatStrip
          items={[
            {
              key: "total",
              label: "Total Observasi",
              value: rukyatData.length.toString(),
              description: "Semua data rukyat",
            },
            {
              key: "visible",
              label: "Hilal Terlihat",
              value: totalVisible.toString(),
              description: `${totalConfirmed} dikonfirmasi`,
            },
            {
              key: "upcoming",
              label: "Gerhana Mendatang",
              value: upcomingEclipses.length.toString(),
              description: "Peristiwa akan datang",
            },
            {
              key: "past",
              label: "Gerhana Tercatat",
              value: pastEclipses.length.toString(),
              description: "Riwayat gerhana",
            },
          ]}
        />
      </Band>

      <div className="grid gap-4 lg:grid-cols-2">
        <Band variant="plain" title="Statistik Hasil Rukyat">
          <div className="space-y-3">
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

        <Band variant="plain" title="Riwayat Gerhana">
          {pastEclipses.length > 0 ? (
            <div className="space-y-2">
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
            <p className="text-sm text-admin-content-fg/60">
              Belum ada riwayat gerhana.
            </p>
          )}
        </Band>
      </div>
    </PageContainer>
  );
}