import { CheckCircle, Archive, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { falakService } from "@/modules/falak/application/service";
import {
  verifyRukyat,
  confirmRukyat,
  archiveRukyat,
} from "@/modules/falak/presentation/falak.action";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "CONFIRMED"
      ? "default"
      : status === "VERIFIED"
        ? "secondary"
        : "outline";

  const label =
    status === "DRAFT"
      ? "Draft"
      : status === "VERIFIED"
        ? "Terverifikasi"
        : status === "CONFIRMED"
          ? "Dikonfirmasi"
          : status === "ARCHIVED"
            ? "Diarsipkan"
            : status;

  return (
    <Badge variant={variant} className="h-5 px-2 text-[11px]">
      {label}
    </Badge>
  );
}

export default async function RukyatPage() {
  const result = await falakService.getRukyatPaginated(1, 50);
  const items = result.items;

  return (
    <PageContainer>
      <PageHeader
        title="Data Rukyat"
        description="Kelola data observasi rukyat."
      />

      <AdminTable
        title="Daftar Observasi Rukyat"
        description={`${items.length} observasi tercatat.`}
        columns={[
          {
            key: "lokasi",
            label: "Lokasi",
            render: (item) => (
              <span className="text-sm font-medium">{item.locationName}</span>
            ),
          },
          {
            key: "tanggal",
            label: "Tanggal",
            render: (item) => (
              <span className="text-xs">
                {formatDate(item.observationDate)}
              </span>
            ),
          },
          {
            key: "cuaca",
            label: "Cuaca",
            render: (item) => <span className="text-xs">{item.weather}</span>,
          },
          {
            key: "hasil",
            label: "Hasil",
            render: (item) => <span className="text-xs">{item.result}</span>,
          },
          {
            key: "status",
            label: "Status",
            render: (item) => <StatusBadge status={item.status} />,
          },
          {
            key: "aksi",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                {item.status === "DRAFT" && (
                  <form action={verifyRukyat.bind(null, item.id)}>
                    <Button variant="ghost" size="sm" aria-label="Verifikasi" title="Verifikasi">
                      <ShieldCheck className="size-3.5" />
                    </Button>
                  </form>
                )}
                {item.status === "VERIFIED" && (
                  <form action={confirmRukyat.bind(null, item.id)}>
                    <Button variant="ghost" size="sm" aria-label="Konfirmasi" title="Konfirmasi">
                      <CheckCircle className="size-3.5" />
                    </Button>
                  </form>
                )}
                {item.status === "CONFIRMED" && (
                  <form action={archiveRukyat.bind(null, item.id)}>
                    <Button variant="ghost" size="sm" aria-label="Arsipkan" title="Arsipkan">
                      <Archive className="size-3.5" />
                    </Button>
                  </form>
                )}
              </div>
            ),
          },
        ]}
        data={items}
        emptyMessage="Belum ada data observasi rukyat."
      />
    </PageContainer>
  );
}
