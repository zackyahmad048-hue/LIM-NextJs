import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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

      <Band variant="raised" title="Tambah Peserta" className="max-w-sm">
        <form
          action={registerParticipant.bind(null, program.id)}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="participant-user" className="text-xs">
              Pilih User
            </Label>
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
      </Band>

      <Band variant="raised">
        <ParticipantsTable data={participants} programId={program.id} />
      </Band>
    </PageContainer>
  );
}