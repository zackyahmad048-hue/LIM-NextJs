import { formatDateInput } from "@/lib/format";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";
import { CheckCircle, Pencil, RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { ActionForm } from "@/components/admin/shared/action-form";

import {
  getDispositionById,
  getIncomingMails,
  updateDisposition,
  transitionDispositionStatus,
} from "@/modules/secretariat";
import { getUsers } from "@/modules/authorization/queries/user.query";

const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const priorities = [
  { value: "LOW", label: "Rendah" },
  { value: "MEDIUM", label: "Sedang" },
  { value: "HIGH", label: "Tinggi" },
  { value: "URGENT", label: "Mendesak" },
];

export default async function EditDispositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [disposition, incomingMails, users] = await Promise.all([
    getDispositionById(id),
    getIncomingMails({ limit: 200 }),
    getUsers(),
  ]);

  if (!disposition) notFound();

  const statusActions: {
    label: string;
    status: string;
    icon: typeof RotateCcw;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[] = [];
  if (disposition.status === "PENDING")
    statusActions.push({
      label: "Mulai",
      status: "IN_PROGRESS",
      icon: RotateCcw,
      variant: "default",
    });
  if (disposition.status === "IN_PROGRESS")
    statusActions.push({
      label: "Selesaikan",
      status: "COMPLETED",
      icon: CheckCircle,
      variant: "default",
    });
  if (!["COMPLETED", "CANCELLED"].includes(disposition.status))
    statusActions.push({
      label: "Batalkan",
      status: "CANCELLED",
      icon: XCircle,
      variant: "destructive",
    });

  return (
    <PageContainer>
      <PageHeader
        title="Edit Disposisi"
        description={`Surat: ${disposition.incomingMail?.registrationNumber ?? "-"} · Status: ${statusLabels[disposition.status] ?? disposition.status}`}
      />

      <div className="flex flex-wrap gap-2">
        {statusActions.map((action) => {
          const Icon = action.icon;
          return (
            <form
              key={action.status}
              action={transitionDispositionStatus.bind(
                null,
                disposition.id,
                action.status,
              )}
            >
              <Button type="submit" variant={action.variant} size="sm">
                <Icon className="size-3.5" />
                {action.label}
              </Button>
            </form>
          );
        })}
      </div>

      <ActionForm
        action={updateDisposition.bind(null, disposition.id)}
        submitLabel="Simpan Perubahan"
        submitIcon={<Pencil className="size-4" />}
      >
        <Band variant="raised" title="Informasi Disposisi">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Surat Masuk" className="md:col-span-2">
              <NativeSelect
                id="incomingMailId"
                name="incomingMailId"
                required
                defaultValue={disposition.incomingMailId}
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih surat masuk</NativeSelectOption>
                {incomingMails.items.map((m) => (
                  <NativeSelectOption key={m.id} value={m.id}>
                    {m.registrationNumber} - {m.subject}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>

            <FormGroup legend="Tujuan Disposisi" className="md:col-span-2">
              <NativeSelect
                id="assignedToId"
                name="assignedToId"
                required
                defaultValue={disposition.assignedToId}
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih tujuan</NativeSelectOption>
                {users.map((u) => (
                  <NativeSelectOption key={u.id} value={u.id}>
                    {u.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>

            <FormGroup legend="Instruksi" className="md:col-span-2">
              <Textarea
                id="instruction"
                name="instruction"
                required
                defaultValue={disposition.instruction}
                className="min-h-20 rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Prioritas">
              <NativeSelect
                id="priority"
                name="priority"
                required
                defaultValue={disposition.priority}
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih prioritas</NativeSelectOption>
                {priorities.map((p) => (
                  <NativeSelectOption key={p.value} value={p.value}>
                    {p.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>

            <FormGroup legend="Batas Waktu">
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={formatDateInput(disposition.dueDate)}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Catatan" className="md:col-span-2">
              <Textarea
                id="notes"
                name="notes"
                defaultValue={disposition.notes ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </FormGroup>
          </div>
        </Band>
      </ActionForm>
    </PageContainer>
  );
}