import { PageContainer } from "@/components/admin/shared/page-container";
import { DashboardClient } from "@/components/admin/dashboard/dashboard-client";

import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { ROLE_LABELS } from "@/config/role";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  const { roleSlugs } = await getCurrentUserPermissions();

  const user = {
    name: session?.user.name ?? "Admin",
    email: session?.user.email ?? "",
    image: session?.user.image ?? null,
    roleLabel:
      roleSlugs.map((slug) => ROLE_LABELS[slug]).filter(Boolean)[0] ?? "Admin",
  };

  return (
    <PageContainer>
      <DashboardClient user={user} roleSlugs={roleSlugs} />
    </PageContainer>
  );
}
