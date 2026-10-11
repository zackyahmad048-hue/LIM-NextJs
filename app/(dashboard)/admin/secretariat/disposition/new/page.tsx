import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { ActionForm } from "@/components/admin/shared/action-form";

import { getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { getUsers } from "@/modules/authorization/queries/user.query";
import { createDisposition } from "@/modules/secretariat/presentation/secretariat.action";

const priorities = [
  { value: "LOW", label: "Rendah" },
  { value: "MEDIUM", label: "Sedang" },
  { value: "HIGH", label: "Tinggi" },
  { value: "URGENT", label: "Mendesak" },
];

export default async function NewDispositionPage() {
  const [incomingMails, users] = await Promise.all([
    getIncomingMails({ limit: 200 }),
    getUsers(),
  ]);

  return (
    <PageContainer>
      <PageHeader
        title="Disposisi Baru"
        description="Buat disposisi baru untuk surat masuk."
      />

      <ActionForm action={createDisposition} submitLabel="Simpan Disposisi" submitIcon={<Plus className="size-4" />}>
        <Band variant="raised" title="Informasi Disposisi" description="Pilih surat masuk dan tentukan instruksi.">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Surat Masuk" className="md:col-span-2">
              <NativeSelect
                id="incomingMailId"
                name="incomingMailId"
                required
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
                className="min-h-20 rounded-md text-xs"
                placeholder="Instruksi disposisi"
              />
            </FormGroup>

            <FormGroup legend="Prioritas">
              <NativeSelect
                id="priority"
                name="priority"
                required
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
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Catatan" className="md:col-span-2">
              <Textarea
                id="notes"
                name="notes"
                className="min-h-20 rounded-md text-xs"
                placeholder="Catatan (opsional)"
              />
            </FormGroup>
          </div>
        </Band>
      </ActionForm>
    </PageContainer>
  );
}