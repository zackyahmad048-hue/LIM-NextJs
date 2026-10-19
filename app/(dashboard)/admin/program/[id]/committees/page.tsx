import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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

      <Band variant="raised" title="Tambah Panitia" className="max-w-sm">
        <form
          action={assignCommittee.bind(null, program.id)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="committee-user" className="text-xs">
              User
            </Label>
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
            <Label htmlFor="committee-role" className="text-xs">
              Peran
            </Label>
            <Input
              id="committee-role"
              name="role"
              required
              className="rounded-md text-xs"
              placeholder="Ketua, Sekretaris, dll"
            />
          </div>
          <Button type="submit" size="sm">
            Tambah Panitia
          </Button>
        </form>
      </Band>

      <Band variant="raised">
        <CommitteesTable data={committees} programId={program.id} />
      </Band>
    </PageContainer>
  );
}