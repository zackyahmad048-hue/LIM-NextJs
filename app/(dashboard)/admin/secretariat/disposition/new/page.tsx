import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
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
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Disposisi</h2>
            <p className="text-xs text-muted-foreground">
              Pilih surat masuk dan tentukan instruksi.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="incomingMailId" className="text-xs">
                Surat Masuk
              </Label>
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
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="assignedToId" className="text-xs">
                Tujuan Disposisi
              </Label>
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
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="instruction" className="text-xs">
                Instruksi
              </Label>
              <Textarea
                id="instruction"
                name="instruction"
                required
                className="min-h-20 rounded-md text-xs"
                placeholder="Instruksi disposisi"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs">
                Prioritas
              </Label>
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
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-xs">
                Batas Waktu
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="notes" className="text-xs">
                Catatan
              </Label>
              <Textarea
                id="notes"
                name="notes"
                className="min-h-20 rounded-md text-xs"
                placeholder="Catatan (opsional)"
              />
            </div>
          </div>
        </SectionCard>
      </ActionForm>
    </PageContainer>
  );
}
