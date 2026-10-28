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

/*
 * Nada status memakai token semantik, bukan palet Tailwind mentah.
 * `--success`/`--warning` terlalu terang untuk teks di mode terang
 * (1.91:1 dan 1.36:1), jadi warna dibawa teks di mode gelap; di mode terang
 * label memakai warna konten (kontras tinggi) dan tidak kehilangan makna
 * karena status selalu berpasangan dengan label teksnya.
 * `ARCHIVED` memakai `text-muted-foreground` (6.93:1 terang / 7.33:1 gelap);
 * `text-admin-content-fg/50` hanya 3.38:1 sehingga gagal AA untuk teks.
 */
const STATUS_TONE: Record<string, string> = {
  CONFIRMED: "",
  VERIFIED: "",
  DRAFT: "",
  ARCHIVED: "text-muted-foreground",
};

const SECTION_LINK =
  "rounded text-xs font-medium text-primary transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

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

      <Band variant="raised" tint="falak">
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
              label: "Gerhana Mendatang",
              value: eclipses.length.toString(),
              description: "Peristiwa astronomi",
            },
          ]}
        />
      </Band>

      <div className="grid gap-4 lg:grid-cols-2">
        <Band
          variant="plain"
          title="Observasi Rukyat Terbaru"
          actions={
            <Link href="/admin/falak/rukyat" className={SECTION_LINK}>
              Lihat semua
            </Link>
          }
        >
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
                        STATUS_TONE[r.status] ?? "text-muted-foreground"
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

        <Band
          variant="plain"
          title="Gerhana Mendatang"
          actions={
            <Link href="/admin/falak/eclipse" className={SECTION_LINK}>
              Lihat semua
            </Link>
          }
        >
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
              Tidak ada gerhana mendatang.
            </p>
          )}
        </Band>
      </div>
    </PageContainer>
  );
}