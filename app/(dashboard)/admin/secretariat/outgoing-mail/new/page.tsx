import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getLetterLevelOptions } from "@/modules/organization";
import { OutgoingMailForm } from "./outgoing-mail-form";

export const dynamic = "force-dynamic";

export default async function NewOutgoingMailPage() {
  const levels = await getLetterLevelOptions();

  return (
    <PageContainer>
      <PageHeader
        title="Surat Keluar Baru"
        description="Nomor dan QR verifikasi diterbitkan otomatis saat surat ditandai terkirim."
      />

      <div className="mt-4">
        <OutgoingMailForm levels={levels} />
      </div>
    </PageContainer>
  );
}
