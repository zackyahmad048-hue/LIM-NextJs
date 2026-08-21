import { PermohonanWizard } from "@/components/website/wajib-khidmah/permohonan-form";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";

export const metadata = {
  title: "Permohonan Guru Bantu | LIM Digital Platform",
  description:
    "Pengajuan permohonan guru bantu untuk lembaga pemohon dalam program Tim Wajib Khidmah.",
};

export const dynamic = "force-dynamic";

export default function PermohonanPage() {
  return (
    <>
      <PageHeader
        title="Permohonan Guru Bantu"
        description="Isi formulir berikut untuk mengajukan permohonan guru bantu dari Pondok Pesantren Lirboyo. Formulir terdiri dari beberapa langkah yang dapat diselesaikan satu per satu."
        centered
      />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="mb-8 text-center">
          <SectionLabel>Tim Wajib Khidmah</SectionLabel>
        </div>
        <PermohonanWizard />
      </section>
    </>
  );
}
