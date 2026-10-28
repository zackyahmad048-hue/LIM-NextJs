import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/admin/layout/dashboard-shell";

import { getSession } from "@/modules/authentication/infrastructure/session.helper";
import { getCurrentUserPermissions } from "@/modules/authorization/queries/current-user-permission.query";
import { ROLE_LABELS } from "@/config/role";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { roleSlugs } = await getCurrentUserPermissions();
  const roleLabel =
    roleSlugs.map((slug) => ROLE_LABELS[slug]).filter(Boolean)[0] ?? "Admin";

  const user = {
    name: session.user.name ?? "Admin",
    email: session.user.email ?? "",
    image: session.user.image ?? null,
    roleLabel,
  };

  return (
    <DashboardShell roleSlugs={roleSlugs} user={user}>
      {children}
    </DashboardShell>
  );
}