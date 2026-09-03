import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import { FalakDataTable } from "@/components/website/falak/data-table";
import { falakService } from "@/modules/falak/application/service";
import { formatDateId } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hisab | Falak | LIM Digital Platform",
  description:
    "Data perhitungan hisab hilal dan kriteria imkanur rukyat Lembaga Ittihadul Muballighin.",
};

export default async function HisabPage() {
  const { items, total } = await falakService.getHisabPaginated(1, 20);

  return (
    <>
      <PageHeader
        title="Data Hisab"
        description="Perhitungan hilal dan kriteria imkanur rukyat dari titik-titik pantau seluruh Indonesia."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <FalakDataTable
            title="Hasil Hisab"
            description={`${total} data hisab tercatat.`}
            columns={[
              { header: "Lokasi", className: "font-medium" },
              { header: "Koordinat" },
              { header: "Tanggal Hisab", className: "text-right" },
            ]}
            rows={items.map((item) => ({
              key: item.id,
              cells: [
                <span key="loc" className="font-medium text-foreground">
                  {item.locationName}
                </span>,
                <span key="coord" className="tabular-nums text-muted-foreground">
                  {`${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`}
                </span>,
                <span
                  key="date"
                  className="tabular-nums text-muted-foreground [display:block] text-right"
                >
                  {formatDateId(item.calculationDate)}
                </span>,
              ],
            }))}
            emptyMessage="Belum ada data hisab yang dipublikasikan."
          />
        </Reveal>
      </section>
    </>
  );
}