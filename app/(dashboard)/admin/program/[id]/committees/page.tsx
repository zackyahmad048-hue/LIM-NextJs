import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getProgramById,
  getCommittees,
  getUsers,
} from "@/modules/program/queries/program.query";
import { assignCommittee } from "@/modules/program/presentation/program.action";
import { CommitteesTable } from "./committees-table";

export default async function CommitteesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, committees, users] = await Promise.all([
    getProgramById(id),
    getCommittees(id),
    getUsers(),
  ]);

  if (!program) notFound();

  const existingUserIds = new Set(committees.map((c) => c.userId));

  return (
    <PageContainer>
      <PageHeader
        title={`Panitia - ${program.name}`}
        description={`${committees.length} panitia.`}
      />

      <form
        action={assignCommittee.bind(null, program.id)}
        className="max-w-sm space-y-3 rounded-lg border bg-background p-4"
      >
        <h3 className="text-sm font-semibold">Tambah Panitia</h3>
        <div className="space-y-1.5">
          <label htmlFor="committee-user" className="text-xs font-medium">
            User
          </label>
          <NativeSelect
            id="committee-user"
            name="userId"
            required
            className="h-9 w-full text-xs"
          >
            <NativeSelectOption value="">Pilih user</NativeSelectOption>
            {users
              .filter((u) => !existingUserIds.has(u.id))
              .map((u) => (
                <NativeSelectOption key={u.id} value={u.id}>
                  {u.name}
                </NativeSelectOption>
              ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="committee-role" className="text-xs font-medium">
            Peran
          </label>
          <input
            id="committee-role"
            name="role"
            required
            className="h-9 w-full text-xs"
            placeholder="Ketua, Sekretaris, dll"
          />
        </div>
        <Button type="submit" size="sm">
          Tambah Panitia
        </Button>
      </form>

      {committees.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada panitia.</p>
      )}

      <CommitteesTable data={committees} programId={program.id} />
    </PageContainer>
  );
}