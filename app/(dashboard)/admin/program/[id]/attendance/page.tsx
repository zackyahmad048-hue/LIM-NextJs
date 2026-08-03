import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import {
  getProgramById,
  getAttendance,
} from "@/modules/program/queries/program.query";
import {
  checkInAttendance,
  checkOutAttendance,
} from "@/modules/program/presentation/program.action";

function formatTime(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const attendanceLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PRESENT: { label: "Hadir", variant: "default" },
  ABSENT: { label: "Tidak Hadir", variant: "destructive" },
  LATE: { label: "Terlambat", variant: "secondary" },
  EXCUSED: { label: "Izin", variant: "outline" },
};

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, attendance] = await Promise.all([
    getProgramById(id),
    getAttendance(id),
  ]);

  if (!program) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Absensi - ${program.name}`}
        description="Catat kehadiran peserta program."
      />

      <AdminTable
        title="Daftar Absensi"
        description={`${attendance.length} catatan kehadiran.`}
        columns={[
          {
            key: "participant",
            label: "Peserta",
            render: (item) => (
              <span className="text-sm font-medium">
                {item.participant.user.name}
              </span>
            ),
          },
          {
            key: "checkIn",
            label: "Check In",
            render: (item) => (
              <span className="text-xs">{formatTime(item.checkIn)}</span>
            ),
          },
          {
            key: "checkOut",
            label: "Check Out",
            render: (item) => (
              <span className="text-xs">{formatTime(item.checkOut)}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (item) => {
              const s = attendanceLabels[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              return (
                <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                  {s.label}
                </Badge>
              );
            },
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                {!item.checkIn && (
                  <form
                    action={checkInAttendance.bind(
                      null,
                      item.participantId,
                      program.id,
                    )}
                  >
                    <Button variant="outline" size="sm">
                      Check In
                    </Button>
                  </form>
                )}
                {item.checkIn && !item.checkOut && (
                  <form
                    action={checkOutAttendance.bind(
                      null,
                      item.participantId,
                      program.id,
                    )}
                  >
                    <Button variant="outline" size="sm">
                      Check Out
                    </Button>
                  </form>
                )}
              </div>
            ),
          },
        ]}
        data={attendance as Array<any>}
        emptyMessage="Belum ada catatan kehadiran."
      />
    </PageContainer>
  );
}
