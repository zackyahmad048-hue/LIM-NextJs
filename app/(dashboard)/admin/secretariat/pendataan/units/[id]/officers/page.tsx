import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, Pencil, Plus, Trash2, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import {
  getOfficers,
  getUnitById,
} from "@/modules/organization";
import { deleteOfficerAction } from "@/modules/organization";

export const dynamic = "force-dynamic";

export default async function OfficersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [unit, officers] = await Promise.all([
    getUnitById(id),
    getOfficers(id),
  ]);

  if (!unit) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Pengurus — ${unit.code}`}
        description={unit.name}
        actions={
          <Button asChild size="sm">
            <Link href={`/admin/secretariat/pendataan/officers/new?unitId=${unit.id}`}>
              <Plus className="size-4" />
              Pengurus Baru
            </Link>
          </Button>
        }
      />

      <AdminTable
        title="Pengurus"
        description={`${officers.length} pengurus terdata pada ${unit.code}.`}
        columns={[
          {
            key: "name",
            label: "Nama",
            render: (item) => (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.name}</span>
                {item.isLeader && (
                  <Badge variant="default" className="h-5 gap-1 px-2 text-[11px]">
                    <Crown className="size-3" />
                    Ketua
                  </Badge>
                )}
              </div>
            ),
          },
          {
            key: "position",
            label: "Jabatan",
            render: (item) => <span className="text-xs">{item.position}</span>,
          },
          {
            key: "phone",
            label: "Kontak",
            render: (item) => (
              <div className="text-xs text-muted-foreground">
                <p>{item.phone ?? "—"}</p>
                {item.email && (
                  <p className="truncate max-w-[180px]">{item.email}</p>
                )}
              </div>
            ),
          },
          {
            key: "sortOrder",
            label: "Urutan",
            render: (item) => (
              <span className="text-xs tabular-nums">{item.sortOrder}</span>
            ),
          },
          {
            key: "actions",
            label: "Aksi",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/secretariat/pendataan/officers/${item.id}/edit`}
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                </Button>
                <form action={deleteOfficerAction.bind(null, item.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </form>
              </div>
            ),
          },
        ]}
        data={officers as any[]}
        emptyMessage="Belum ada pengurus pada unit ini. Tambahkan pengurus pertama."
      />

      {officers.length === 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <UsersRound className="size-4" />
          Klik &quot;Pengurus Baru&quot; untuk mendata ketua dan pengurus unit.
        </div>
      )}
    </PageContainer>
  );
}
