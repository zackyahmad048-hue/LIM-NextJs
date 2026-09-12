import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getRoles } from "@/modules/authorization/presentation/role.query";
import { RolesTable } from "./roles-table";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const roles = (await getRoles()).map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  return (
    <PageContainer>
      <PageHeader
        title="Roles & Permissions"
        description="Kelola peran dan hak akses pengguna."
      />

      {roles.length === 0 && (
        <p className="text-sm text-admin-content-fg/60">Belum ada role.</p>
      )}

      <RolesTable data={roles} />
    </PageContainer>
  );
}