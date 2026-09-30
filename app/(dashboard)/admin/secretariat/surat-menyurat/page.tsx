import { SuratMenyuratClient } from "./surat-menyurat-client";
import {
  getIncomingMails,
  getOutgoingMails,
  getSuratMenyuratStats,
} from "@/modules/secretariat/queries/secretariat.query";
import { getDriveConnection } from "@/modules/shared/infrastructure/storage/google-drive.storage";

export const dynamic = "force-dynamic";

export default async function SuratMenyuratPage() {
  const [stats, outgoing, incoming, drive] = await Promise.all([
    getSuratMenyuratStats(),
    getOutgoingMails({ page: 1, limit: 6 }),
    getIncomingMails({ page: 1, limit: 5 }),
    getDriveConnection(),
  ]);

  return (
    <SuratMenyuratClient
      stats={{
        outgoingTotal: stats.outgoingTotal,
        incomingTotal: stats.incomingTotal,
        archivedTotal: stats.archivedTotal,
        pendingCount: stats.pendingCount,
      }}
      latestIssued={
        stats.latestIssued
          ? {
              id: stats.latestIssued.id,
              fullNumber: stats.latestIssued.fullNumber,
              subject: stats.latestIssued.subject,
              mailDate: stats.latestIssued.mailDate,
              levelCode: stats.latestIssued.levelCode,
              categoryCode: stats.latestIssued.categoryCode,
            }
          : null
      }
      outgoingItems={outgoing.items}
      outgoingTotal={outgoing.total}
      incomingItems={incoming.items}
      incomingTotal={incoming.total}
      driveEmail={drive?.email ?? null}
    />
  );
}
