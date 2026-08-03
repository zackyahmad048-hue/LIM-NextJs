import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

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

      <form action={createDisposition} className="max-w-2xl space-y-3">
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
              <select
                id="incomingMailId"
                name="incomingMailId"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih surat masuk</option>
                {incomingMails.items.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.registrationNumber} - {m.subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="assignedToId" className="text-xs">
                Tujuan Disposisi
              </Label>
              <select
                id="assignedToId"
                name="assignedToId"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih tujuan</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
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
              <select
                id="priority"
                name="priority"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih prioritas</option>
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
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

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            Simpan Disposisi
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
