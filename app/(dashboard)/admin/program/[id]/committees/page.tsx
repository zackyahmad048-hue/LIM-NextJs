import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { ConfirmDelete } from "@/components/admin/shared/confirm-delete";

import {
  getProgramById,
  getCommittees,
  getUsers,
} from "@/modules/program/queries/program.query";
import {
  assignCommittee,
  removeCommittee,
} from "@/modules/program/presentation/program.action";

type Item = Awaited<ReturnType<typeof getCommittees>>[number];

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

      <DataTable<Item, unknown>
        data={committees}
        columns={[
          {
            accessorKey: "user",
            header: "Nama",
            cell: ({ row }) => (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs bg-primary/15 text-primary">
                    {row.original.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-admin-content-fg">
                    {row.original.user.name}
                  </p>
                  <p className="text-xs text-admin-content-fg/60">
                    {row.original.user.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            accessorKey: "role",
            header: "Peran",
            cell: ({ row }) => (
              <span className="text-xs text-admin-content-fg/80">
                {row.original.role}
              </span>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
              <Badge
                variant={row.original.status === "ACTIVE" ? "default" : "secondary"}
                className="h-5 px-2 text-[11px]"
              >
                {row.original.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
              </Badge>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end">
                <ConfirmDelete
                  onConfirm={removeCommittee}
                  args={[row.original.id, program.id]}
                  title="Hapus panitia"
                  description={`Panitia "${row.original.user?.name ?? "tersebut"}" akan dihapus dari panitia.`}
                  label="Hapus panitia"
                />
              </div>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}