import { notFound } from "next/navigation";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getProgramById,
  getAttendance,
} from "@/modules/program/queries/program.query";
import { AttendanceTable } from "./attendance-table";

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

      {attendance.length > 0 && (
        <p className="text-sm text-admin-content-fg/60">
          {attendance.length} catatan kehadiran.
        </p>
      )}

      {attendance.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">
          Belum ada catatan kehadiran.
        </p>
      )}

      <AttendanceTable data={attendance} programId={program.id} />
    </PageContainer>
  );
}