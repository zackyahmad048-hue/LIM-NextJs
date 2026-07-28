import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/layout/sidebar";
import { Header } from "@/components/admin/layout/header";
import { SidebarProvider } from "@/components/admin/providers/sidebar-provider";

import { getSession } from "@/modules/authentication/infrastructure/session.helper";

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Header />

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
