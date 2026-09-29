import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getProgramById, getSchedules } from "@/modules/program/queries/program.query";
import { createSchedule } from "@/modules/program/presentation/program.action";
import { SchedulesTable } from "./schedules-table";

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

      <SchedulesTable data={schedules} programId={program.id} />
    </PageContainer>
  );
}