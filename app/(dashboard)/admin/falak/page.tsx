import { Clock, Calculator, Eye, Eclipse } from "lucide-react";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { StatCard } from "@/components/admin/shared/stat-card";
import { getAllRukyat } from "@/modules/falak/queries/rukyat.query";
import { getUpcomingEclipses } from "@/modules/falak/queries/eclipse.query";

export default async function FalakDashboardPage() {
  const [rukyatData, eclipses] = await Promise.all([
    getAllRukyat(100),
    getUpcomingEclipses(),
  ]);

  const pendingVerifications = rukyatData.filter((r) => r.status === "DRAFT").length;

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
          value="-"
          description="Jadwal harian aktif"
        />
        <StatCard
          title="Observasi Rukyat"
          icon={Eye}
          value={rukyatData.length.toString()}
          description={`${pendingVerifications} menunggu verifikasi`}
        />
        <StatCard
          title="Total Hisab"
          icon={Calculator}
          value="-"
          description="Data perhitungan"
        />
        <StatCard
          title="Eclipse Mendatang"
          icon={Eclipse}
          value={eclipses.length.toString()}
          description="Event astronomi"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard className="p-4">
          <h3 className="font-semibold text-foreground">Observasi Rukyat Terbaru</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {rukyatData.length} observasi tercatat.
          </p>
          {rukyatData.length > 0 ? (
            <div className="mt-4 space-y-2">
              {rukyatData.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{r.locationName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("id-ID").format(r.observationDate)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${
                    r.status === "CONFIRMED" ? "text-green-600" :
                    r.status === "VERIFIED" ? "text-blue-600" :
                    r.status === "DRAFT" ? "text-yellow-600" : "text-muted-foreground"
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Belum ada data observasi.</p>
          )}
        </SectionCard>

        <SectionCard className="p-4">
          <h3 className="font-semibold text-foreground">Eclipse Mendatang</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Event astronomi yang akan datang.
          </p>
          {eclipses.length > 0 ? (
            <div className="mt-4 space-y-2">
              {eclipses.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium">{e.eclipseType === "SOLAR" ? "Gerhana Matahari" : "Gerhana Bulan"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("id-ID").format(e.eclipseDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Tidak ada eclipse mendatang.</p>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  );
}
