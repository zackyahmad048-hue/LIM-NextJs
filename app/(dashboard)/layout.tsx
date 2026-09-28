import { redirect } from "next/navigation";

import { getSession } from "@/modules/authentication/infrastructure/session.helper";

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

  return (
    <div className="site flex min-h-dvh flex-col">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}