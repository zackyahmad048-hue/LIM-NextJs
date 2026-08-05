import { PageContainer } from "@/components/admin/shared/page-container";
import { DashboardClient } from "@/components/admin/dashboard/dashboard-client";

import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { ROLE_LABELS } from "@/config/role";
import { getStructure } from "@/modules/cms/queries/structure.query";
import { getProfilContent } from "@/modules/cms/queries/site-page.query";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  const { roleSlugs } = await getCurrentUserPermissions();
  const [structure, profil] = await Promise.all([
    getStructure(),
    getProfilContent(),
  ]);

  const user = {
    name: session?.user.name ?? "Admin",
    email: session?.user.email ?? "",
    image: session?.user.image ?? null,
    roleLabel:
      roleSlugs.map((slug) => ROLE_LABELS[slug]).filter(Boolean)[0] ??
      "Admin",
  };

  return (
    <PageContainer>
      <DashboardClient
        user={user}
        roleSlugs={roleSlugs}
        structure={structure}
        profil={profil}
      />
    </PageContainer>
  );
}