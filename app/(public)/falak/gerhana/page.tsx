import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { FalakDataTable } from "@/components/website/falak/data-table";
import { falakService } from "@/modules/falak/application/service";
import { formatDateId } from "@/lib/format";
import type { EclipseType } from "@/generated/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gerhana | Falak | LIM Digital Platform",
  description:
    "Jadwal gerhana matahari dan bulan beserta visibilitasnya dari wilayah Indonesia.",
};

const ECLIPSE_TYPE_LABEL: Record<EclipseType, string> = {
  SOLAR: "Matahari",
  LUNAR: "Bulan",
};

export default async function GerhanaPage() {
  const { items, total } = await falakService.getEclipsePaginated(1, 20);

  return (
    <>
      <PageHeader
        title="Jadwal Gerhana"
        description="Gerhana matahari dan bulan yang tercatat, beserta visibilitasnya dari Indonesia."
      />

      <SiteSection>
        <Reveal>
          <FalakDataTable
            title="Daftar Gerhana"
            description={`${total} peristiwa gerhana tercatat.`}
            columns={[
              { header: "Jenis", className: "font-medium" },
              { header: "Tanggal", className: "text-right" },
              { header: "Visibilitas" },
            ]}
            rows={items.map((item) => ({
              key: item.id,
              cells: [
                <span key="type">
                  <Badge
                    variant={item.eclipseType === "SOLAR" ? "default" : "outline"}
                  >
                    Gerhana {ECLIPSE_TYPE_LABEL[item.eclipseType]}
                  </Badge>
                </span>,
                <span
                  key="date"
                  className="tabular-nums text-muted-foreground [display:block] text-right"
                >
                  {formatDateId(item.eclipseDate)}
                </span>,
                <span key="visibility" className="text-muted-foreground">
                  {item.visibility || "Belum dirilis"}
                </span>,
              ],
            }))}
            emptyMessage="Belum ada data gerhana yang dipublikasikan."
          />
        </Reveal>
      </SiteSection>
    </>
  );
}