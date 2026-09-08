import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getUsers } from "@/modules/authorization/queries/user.query";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <PageContainer>
      <PageHeader
        title="Pengguna"
        description="Daftar pengguna yang terdaftar di sistem."
      />

      <UsersTable data={users} />
    </PageContainer>
  );
}