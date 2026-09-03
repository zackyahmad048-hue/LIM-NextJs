import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import { FalakDataTable } from "@/components/website/falak/data-table";
import { falakService } from "@/modules/falak/application/service";
import { formatDateId } from "@/lib/format";
import type { RukyatResult } from "@/generated/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rukyat | Falak | LIM Digital Platform",
  description:
    "Laporan observasi hilal per wilayah beserta kesaksian saksi Lembaga Ittihadul Muballighin.",
};

const RUKYAT_RESULT_LABEL: Record<RukyatResult, string> = {
  VISIBLE: "Tampak",
  NOT_VISIBLE: "Belum Tampak",
  CLOUDY: "Tertutup Awan",
  UNKNOWN: "Tidak Diketahui",
};

export default async function RukyatPage() {
  const { items, total } = await falakService.getRukyatPaginated(
    1,
    20,
    undefined,
    "CONFIRMED",
  );

  return (
    <>
      <PageHeader
        title="Laporan Rukyat"
        description="Hasil observasi hilal dari titik-titik pantau yang telah terkonfirmasi, beserta cuaca saat pemantauan."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal>
          <FalakDataTable
            title="Observasi Hilal Terkonfirmasi"
            description={`${total} laporan rukyat terkonfirmasi.`}
            columns={[
              { header: "Lokasi", className: "font-medium" },
              { header: "Tanggal Observasi", className: "text-right" },
              { header: "Cuaca" },
              { header: "Hasil" },
            ]}
            rows={items.map((item) => ({
              key: item.id,
              cells: [
                <span key="loc" className="font-medium text-foreground">
                  {item.locationName}
                </span>,
                <span
                  key="date"
                  className="tabular-nums text-muted-foreground [display:block] text-right"
                >
                  {formatDateId(item.observationDate)}
                </span>,
                <span key="weather" className="text-muted-foreground">
                  {item.weather}
                </span>,
                <span key="result">
                  <Badge variant="secondary">
                    {RUKYAT_RESULT_LABEL[item.result]}
                  </Badge>
                </span>,
              ],
            }))}
            emptyMessage="Belum ada laporan rukyat terkonfirmasi."
          />
        </Reveal>
      </section>
    </>
  );
}