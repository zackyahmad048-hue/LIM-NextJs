import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { ImsakiyahImportButton } from "@/components/admin/falak/imsakiyah-import-button";
import { getAllImsakiyah } from "@/modules/falak/queries/imsakiyah.query";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ImsakiyahPage() {
  const items = await getAllImsakiyah();

  return (
    <PageContainer>
      <PageHeader
        title="Imsakiyah"
        description="Jadwal imsakiyah Ramadan yang ditampilkan di website."
        actions={<ImsakiyahImportButton />}
      />

      <AdminTable
        title="Data Imsakiyah"
        description={`${items.length} hari tercatat.`}
        columns={[
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => <span className="text-xs">{formatDate(item.gregorianDate)}</span>,
          },
          {
            key: "ramadanKe",
            label: "Ramadan Ke",
            render: (item) => <span className="text-xs font-medium">{item.ramadanDay}</span>,
          },
          {
            key: "hijriah",
            label: "Hijriah",
            render: (item) => (
              <span className="text-xs">{item.hijriDate} {item.hijriMonth} {item.hijriYear}</span>
            ),
          },
          {
            key: "imsak",
            label: "Imsak",
            render: (item) => <span className="font-mono text-xs">{item.imsak}</span>,
          },
          {
            key: "subuh",
            label: "Subuh",
            render: (item) => <span className="font-mono text-xs">{item.subuh}</span>,
          },
          {
            key: "dzuhur",
            label: "Dzuhur",
            render: (item) => <span className="font-mono text-xs">{item.dzuhur}</span>,
          },
          {
            key: "ashar",
            label: "Ashar",
            render: (item) => <span className="font-mono text-xs">{item.ashar}</span>,
          },
          {
            key: "maghrib",
            label: "Maghrib",
            render: (item) => <span className="font-mono text-xs">{item.maghrib}</span>,
          },
          {
            key: "isya",
            label: "Isya",
            render: (item) => <span className="font-mono text-xs">{item.isya}</span>,
          },
          {
            key: "faseBulan",
            label: "Fase Bulan",
            render: (item) => <span className="text-xs">{item.moonPhase ?? "-"}</span>,
          },
          {
            key: "lokasi",
            label: "Lokasi",
            render: (item) => (
              <span className="text-xs">{item.city}, {item.province}</span>
            ),
          },
        ]}
        data={items}
        emptyMessage="Belum ada data imsakiyah. Klik 'Import dari Google Sheets' untuk mengisi."
      />
    </PageContainer>
  );
}
