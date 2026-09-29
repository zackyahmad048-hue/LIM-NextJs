import { getTwkReport } from "@/modules/twk/queries/twk.query";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { TwkModule } from "@/components/admin/twk";

export default async function Page() {
  const { members, stats } = await getTwkReport();

  return (
    <PageContainer>
      <PageHeader
        title="Tim Wajib Khidmah"
        description="Kelola data Peserta Wajib Khidmah: tambah, edit, impor, dan cetak laporan."
      />
      <TwkModule members={members} stats={stats} />
    </PageContainer>
  );
}
