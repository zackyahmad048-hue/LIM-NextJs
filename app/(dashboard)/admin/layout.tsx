import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/layout/sidebar";
import { MobileSidebar } from "@/components/admin/layout/mobile-sidebar";
import { Header } from "@/components/admin/layout/header";
import { Footer } from "@/components/admin/layout/footer";
import { SidebarProvider } from "@/components/admin/providers/sidebar-provider";
import AmbientBackground from "@/components/shared/ambient-background";

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
    redirect("/login");
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
      <div className="admin flex min-h-dvh w-full">
        <AmbientBackground />

        <Sidebar roleSlugs={roleSlugs} />
        <MobileSidebar roleSlugs={roleSlugs} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} roleSlugs={roleSlugs} />

          <div className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-6 md:gap-8">
              {children}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}