import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";

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
        title="Peran & Hak Akses"
        description="Kelola peran dan hak akses pengguna."
      />

      <Band variant="raised">
        <RolesTable data={roles} />
      </Band>
    </PageContainer>
  );
}