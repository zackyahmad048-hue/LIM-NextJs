"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { SidebarProvider } from "../providers/sidebar-provider";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { Header } from "./header";
import { Footer } from "./footer";
import AmbientBackground from "@/components/shared/ambient-background";

interface DashboardShellUser {
  name: string;
  email: string;
  image: string | null;
  roleLabel: string;
}

interface DashboardShellProps {
  roleSlugs: string[];
  user: DashboardShellUser;
  children: ReactNode;
  className?: string;
}

/** Shell admin reusable: sidebar (desktop + mobile) + header + main + footer.
 *  Isi (children) mengisi area utama; ritme vertikal tetap ditangani PageContainer. */
export function DashboardShell({
  roleSlugs,
  user,
  children,
  className,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className={cn("admin flex min-h-dvh w-full", className)}>
        <AmbientBackground />

        <Sidebar roleSlugs={roleSlugs} />
        <MobileSidebar roleSlugs={roleSlugs} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header user={user} roleSlugs={roleSlugs} />

          <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
