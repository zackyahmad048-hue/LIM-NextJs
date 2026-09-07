import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import {
  getProgramById,
  getSchedules,
} from "@/modules/program/queries/program.query";
import {
  createSchedule,
  deleteSchedule,
} from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getSchedules>>[number];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function SchedulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, schedules] = await Promise.all([
    getProgramById(id),
    getSchedules(id),
  ]);

  if (!program) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Jadwal - ${program.name}`}
        description="Atur jadwal pelaksanaan program."
      />

      <form
        action={createSchedule.bind(null, program.id)}
        className="max-w-lg space-y-3 rounded-lg border bg-background p-4"
      >
        <h3 className="text-sm font-semibold">Tambah Jadwal</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="sched-title" className="text-xs font-medium">Judul</label>
            <input
              id="sched-title"
              name="title"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sched-start" className="text-xs font-medium">Waktu Mulai</label>
            <input
              id="sched-start"
              name="startTime"
              type="datetime-local"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sched-end" className="text-xs font-medium">Waktu Selesai</label>
            <input
              id="sched-end"
              name="endTime"
              type="datetime-local"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="sched-desc" className="text-xs font-medium">Keterangan (opsional)</label>
            <textarea
              id="sched-desc"
              name="description"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            />
          </div>
        </div>
        <Button type="submit" size="sm">
          Simpan Jadwal
        </Button>
      </form>

      {schedules.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {schedules.length} jadwal.
        </p>
      )}

      {schedules.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada jadwal. Tambah jadwal pertama.
        </p>
      )}

      <DataTable<Item, unknown>
        data={schedules}
        columns={[
          {
            accessorKey: "title",
            header: "Judul",
            cell: ({ row }) => (
              <span className="text-sm font-medium text-admin-content-fg">
                {row.original.title}
              </span>
            ),
          },
          {
            accessorKey: "startTime",
            header: "Mulai",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {formatTime(row.original.startTime)}
              </span>
            ),
          },
          {
            accessorKey: "endTime",
            header: "Selesai",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {formatTime(row.original.endTime)}
              </span>
            ),
          },
          {
            accessorKey: "description",
            header: "Keterangan",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/60">
                {row.original.description || "-"}
              </span>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end">
                <ConfirmDelete
                  onConfirm={deleteSchedule}
                  args={[row.original.id, program.id]}
                  title="Hapus jadwal"
                  description={`Jadwal "${row.original.title}" akan dihapus permanen.`}
                  label="Hapus jadwal"
                />
              </div>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}