import { PageContainer } from "@/components/admin/shared/page-container";
import { DashboardClient } from "@/components/admin/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <PageContainer>
      <DashboardClient />
    </PageContainer>
  );
}
