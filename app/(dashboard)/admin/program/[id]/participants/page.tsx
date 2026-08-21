import { notFound } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import {
  getProgramById,
  getParticipants,
  getUsers,
} from "@/modules/program/queries/program.query";
import {
  registerParticipant,
  updateParticipantStatus,
  removeParticipant,
} from "@/modules/program/presentation/program.action";

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  APPROVED: { label: "Diterima", variant: "default" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Batal", variant: "secondary" },
};

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
          <select
            id="participant-user"
            name="userId"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          >
            <option value="">Pilih user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="sm">
          Daftarkan Peserta
        </Button>
      </form>

      <AdminTable
        title="Daftar Peserta"
        description={`${participants.length} peserta.`}
        columns={[
          {
            key: "user",
            label: "Peserta",
            render: (item) => (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs bg-orange-100 text-orange-600">
                    {item.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.user.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "registrationDate",
            label: "Tanggal Daftar",
            render: (item) => (
              <span className="text-xs">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(item.registrationDate)}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (item) => {
              const s = statusLabels[item.registrationStatus] ?? {
                label: item.registrationStatus,
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
                {item.registrationStatus === "PENDING" && (
                  <>
                    <form
                      action={updateParticipantStatus.bind(
                        null,
                        item.id,
                        program.id,
                        "APPROVED",
                      )}
                    >
                      <Button variant="ghost" size="sm" aria-label="Terima peserta" title="Terima">
                        <CheckCircle className="size-3.5 text-amber-600" />
                      </Button>
                    </form>
                    <form
                      action={updateParticipantStatus.bind(
                        null,
                        item.id,
                        program.id,
                        "REJECTED",
                      )}
                    >
                      <Button variant="ghost" size="sm" aria-label="Tolak peserta" title="Tolak">
                        <XCircle className="size-3.5 text-destructive" />
                      </Button>
                    </form>
                  </>
                )}
                <ConfirmDelete
                  onConfirm={removeParticipant}
                  args={[item.id, program.id]}
                  title="Hapus peserta"
                  description={`Peserta "${item.user?.name ?? "tersebut"}" akan dihapus dari program.`}
                  label="Hapus peserta"
                />
              </div>
            ),
          },
        ]}
        data={participants as any[]}
        emptyMessage="Belum ada peserta."
      />
    </PageContainer>
  );
}
