import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

import { getRoles } from "@/modules/authorization/presentation/role.query";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <PageContainer>
      <PageHeader
        title="Roles & Permissions"
        description="Kelola peran dan hak akses pengguna."
      />

      <AdminTable
        title="Daftar Role"
        description={`${roles.length} role terdaftar.`}
        columns={[
          {
            key: "role",
            label: "Role",
            render: (role) => (
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" />
                <span className="font-medium">{role.name}</span>
              </div>
            ),
          },
          {
            key: "slug",
            label: "Slug",
            render: (role) => (
              <Badge variant="outline" className="text-[11px] font-mono">
                {role.slug}
              </Badge>
            ),
          },
          {
            key: "deskripsi",
            label: "Deskripsi",
            render: (role) => (
              <span className="text-muted-foreground">
                {role.description || <span className="italic">—</span>}
              </span>
            ),
          },
          {
            key: "dibuat",
            label: "Dibuat",
            render: (role) => (
              <span className="tabular-nums text-muted-foreground">
                {new Date(role.createdAt).toLocaleDateString("id-ID")}
              </span>
            ),
          },
        ]}
        data={roles}
        emptyMessage="Belum ada role."
      />
    </PageContainer>
  );
}
