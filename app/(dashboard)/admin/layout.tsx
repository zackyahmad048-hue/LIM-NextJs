import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/layout/sidebar";
import { MobileSidebar } from "@/components/admin/layout/mobile-sidebar";
import { Header } from "@/components/admin/layout/header";
import { Footer } from "@/components/admin/layout/footer";
import { SidebarProvider } from "@/components/admin/providers/sidebar-provider";

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
    <SidebarProvider>
      <div className="flex min-h-dvh bg-transparent">
        <Sidebar roleSlugs={roleSlugs} />
        <MobileSidebar roleSlugs={roleSlugs} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} />

          <main className="flex-1 overflow-x-hidden">{children}</main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
