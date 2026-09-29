import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SecretariatDashboard } from "@/components/admin/secretariat/dashboard/secretariat-dashboard";

import {
  getDashboardActionQueue,
  getDashboardHealth,
  getDashboardTrend,
  getSecretariatDashboardData,
  getSecretariatStats,
} from "@/modules/secretariat/queries/secretariat.query";

export const dynamic = "force-dynamic";

export default async function SecretariatDashboardPage() {
  const [stats, trend, queue, recent, health] = await Promise.all([
    getSecretariatStats(),
    getDashboardTrend(12),
    getDashboardActionQueue(8),
    getSecretariatDashboardData(5),
    getDashboardHealth(),
  ]);

  const recentActivity = {
    outgoing: recent.recentOutgoing.map((item) => ({
      id: item.id,
      registrationNumber: item.registrationNumber,
      subject: item.subject,
      status: item.status,
      mailDate: item.mailDate,
    })),
    incoming: recent.recentIncoming.map((item) => ({
      id: item.id,
      registrationNumber: item.registrationNumber,
      sender: item.sender,
      subject: item.subject,
      status: item.status,
      receivedDate: item.receivedDate,
    })),
    agendas: recent.upcomingAgendas.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      location: item.location,
    })),
  };

  return (
    <PageContainer>
      <PageHeader
        title="Sekretariat"
        description="Ringkasan surat-menyurat, disposisi, dan kesehatan sistem."
      />

      <SecretariatDashboard
        stats={stats}
        trend={trend}
        queue={queue}
        recent={recentActivity}
        health={health}
      />
    </PageContainer>
  );
}
