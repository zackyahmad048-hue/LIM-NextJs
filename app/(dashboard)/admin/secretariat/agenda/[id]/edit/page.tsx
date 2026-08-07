import { notFound } from "next/navigation";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AgendaForm } from "../agenda-form";
import {
  getAgendaBookById,
} from "@/modules/secretariat/queries/secretariat.query";
import { updateAgendaBook } from "@/modules/secretariat/presentation/secretariat.action";

function formatDateInput(date: Date | string) {
  return new Date(date).toISOString().split("T")[0];
}

export default async function EditAgendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agenda = await getAgendaBookById(id);
  if (!agenda) notFound();

  return (
    <PageContainer>
      <PageHeader
        title="Edit Agenda"
        description={`${agenda.title} · ${formatDateInput(agenda.date)}`}
      />

      <AgendaForm
        action={updateAgendaBook.bind(null, agenda.id)}
        submitLabel="Simpan Perubahan"
        initial={{
          date: formatDateInput(agenda.date),
          title: agenda.title,
          description: agenda.description ?? "",
          location: agenda.location ?? "",
          participants: agenda.participants ?? "",
          notes: agenda.notes ?? "",
        }}
      />
    </PageContainer>
  );
}
