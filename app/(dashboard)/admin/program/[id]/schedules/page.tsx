import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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

      <Band variant="raised" title="Tambah Jadwal" className="max-w-lg">
        <form
          action={createSchedule.bind(null, program.id)}
          className="space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="sched-title" className="text-xs">
                Judul
              </Label>
              <Input
                id="sched-title"
                name="title"
                required
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sched-start" className="text-xs">
                Waktu Mulai
              </Label>
              <Input
                id="sched-start"
                name="startTime"
                type="datetime-local"
                required
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sched-end" className="text-xs">
                Waktu Selesai
              </Label>
              <Input
                id="sched-end"
                name="endTime"
                type="datetime-local"
                required
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="sched-desc" className="text-xs">
                Keterangan (opsional)
              </Label>
              <Textarea
                id="sched-desc"
                name="description"
                className="min-h-20 rounded-md text-xs"
              />
            </div>
          </div>
          <Button type="submit" size="sm">
            Simpan Jadwal
          </Button>
        </form>
      </Band>

      <Band variant="raised">
        <SchedulesTable data={schedules} programId={program.id} />
      </Band>
    </PageContainer>
  );
}