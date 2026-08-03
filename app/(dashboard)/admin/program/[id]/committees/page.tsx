import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import {
  getProgramById,
  getCommittees,
  getUsers,
} from "@/modules/program/queries/program.query";
import {
  assignCommittee,
  removeCommittee,
} from "@/modules/program/presentation/program.action";

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
          <label className="text-xs font-medium">User</label>
          <select
            name="userId"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
          >
            <option value="">Pilih user</option>
            {users
              .filter((u) => !existingUserIds.has(u.id))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Peran</label>
          <input
            name="role"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            placeholder="Ketua, Sekretaris, dll"
          />
        </div>
        <Button type="submit" size="sm">
          Tambah Panitia
        </Button>
      </form>

      <AdminTable
        title="Daftar Panitia"
        description={`${committees.length} panitia.`}
        columns={[
          {
            key: "user",
            label: "Nama",
            render: (item) => (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs bg-primary/15 text-primary">
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
            key: "role",
            label: "Peran",
            render: (item) => <span className="text-xs">{item.role}</span>,
          },
          {
            key: "status",
            label: "Status",
            render: (item) => (
              <Badge
                variant={item.status === "ACTIVE" ? "default" : "secondary"}
                className="h-5 px-2 text-[11px]"
              >
                {item.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
              </Badge>
            ),
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <form action={removeCommittee.bind(null, item.id, program.id)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </form>
            ),
          },
        ]}
        data={committees as any[]}
        emptyMessage="Belum ada panitia."
      />
    </PageContainer>
  );
}
