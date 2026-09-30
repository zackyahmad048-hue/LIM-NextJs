import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import {
  getProgramById,
  getParticipants,
  getUsers,
} from "@/modules/program/queries/program.query";
import { registerParticipant } from "@/modules/program/presentation/program.action";
import { ParticipantsTable } from "./participants-table";

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, participants, users] = await Promise.all([
    getProgramById(id),
    getParticipants(id),
    getUsers(),
  ]);

  if (!program) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Peserta - ${program.name}`}
        description={`${participants.length} peserta terdaftar.`}
      />

      <form
        action={registerParticipant.bind(null, program.id)}
        className="max-w-sm space-y-3 rounded-lg border bg-background p-4"
      >
        <h3 className="text-sm font-semibold">Tambah Peserta</h3>
        <div className="space-y-1.5">
          <label
            htmlFor="participant-user"
            className="text-xs font-medium"
          >
            Pilih User
          </label>
          <NativeSelect
            id="participant-user"
            name="userId"
            required
            className="h-9 w-full text-xs"
          >
            <NativeSelectOption value="">Pilih user</NativeSelectOption>
            {users.map((u) => (
              <NativeSelectOption key={u.id} value={u.id}>
                {u.name} ({u.email})
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit" size="sm">
          Daftarkan Peserta
        </Button>
      </form>

      {participants.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada peserta.</p>
      )}

      <ParticipantsTable data={participants} programId={program.id} />
    </PageContainer>
  );
}