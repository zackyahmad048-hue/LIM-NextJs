import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AgendaForm } from "../agenda-form";
import { createAgendaBook } from "@/modules/secretariat/presentation/secretariat.action";

export default function NewAgendaPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Agenda Baru"
        description="Buat agenda rapat atau kegiatan baru."
      />

      <AgendaForm action={createAgendaBook} submitLabel="Simpan Agenda" />
    </PageContainer>
  );
}
