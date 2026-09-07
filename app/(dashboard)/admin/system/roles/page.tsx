import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { DataTable } from "@/components/admin/shared/data-table";
import { formatDateId } from "@/lib/format";

import { getRoles } from "@/modules/authorization/presentation/role.query";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <PageContainer>
      <PageHeader
        title="Roles & Permissions"
        description="Kelola peran dan hak akses pengguna."
      />

      {roles.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada role.</p>
      )}

      <DataTable
        data={roles}
        columns={[
          {
            accessorKey: "name",
            header: "Role",
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <span className="font-medium">{row.original.name}</span>
              </div>
            ),
          },
          {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => (
              <Badge variant="outline" className="text-[11px] font-mono">
                {row.original.slug}
              </Badge>
            ),
          },
          {
            accessorKey: "description",
            header: "Deskripsi",
            cell: ({ row }) => (
              <span className="text-muted-foreground">
                {row.original.description || (
                  <span className="italic">—</span>
                )}
              </span>
            ),
          },
          {
            accessorKey: "createdAt",
            header: "Dibuat",
            cell: ({ row }) => (
              <span className="tabular-nums text-muted-foreground">
                {formatDateId(row.original.createdAt)}
              </span>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}