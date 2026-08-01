import { notFound } from "next/navigation";
import {
  CheckCircle,
  Pencil,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { getDispositionById, getIncomingMails } from "@/modules/secretariat/queries/secretariat.query";
import { getUsers } from "@/modules/authorization/queries/user.query";
import { updateDisposition, transitionDispositionStatus } from "@/modules/secretariat/presentation/secretariat.action";

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

function formatDateInput(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

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

  const statusActions: { label: string; status: string; icon: typeof RotateCcw; variant: "default" | "secondary" | "destructive" | "outline" }[] = [];
  if (disposition.status === "PENDING") statusActions.push({ label: "Mulai", status: "IN_PROGRESS", icon: RotateCcw, variant: "default" });
  if (disposition.status === "IN_PROGRESS") statusActions.push({ label: "Selesaikan", status: "COMPLETED", icon: CheckCircle, variant: "default" });
  if (!["COMPLETED", "CANCELLED"].includes(disposition.status)) statusActions.push({ label: "Batalkan", status: "CANCELLED", icon: XCircle, variant: "destructive" });

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
            <form key={action.status} action={transitionDispositionStatus.bind(null, disposition.id, action.status)}>
              <Button type="submit" variant={action.variant} size="sm">
                <Icon className="size-3.5" />
                {action.label}
              </Button>
            </form>
          );
        })}
      </div>

      <form action={updateDisposition.bind(null, disposition.id)} className="max-w-2xl space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Disposisi</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="incomingMailId" className="text-xs">Surat Masuk</Label>
              <select
                id="incomingMailId"
                name="incomingMailId"
                required
                defaultValue={disposition.incomingMailId}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih surat masuk</option>
                {incomingMails.items.map((m) => (
                  <option key={m.id} value={m.id}>{m.registrationNumber} - {m.subject}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="assignedToId" className="text-xs">Tujuan Disposisi</Label>
              <select
                id="assignedToId"
                name="assignedToId"
                required
                defaultValue={disposition.assignedToId}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih tujuan</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="instruction" className="text-xs">Instruksi</Label>
              <Textarea id="instruction" name="instruction" required defaultValue={disposition.instruction} className="min-h-20 rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs">Prioritas</Label>
              <select
                id="priority"
                name="priority"
                required
                defaultValue={disposition.priority}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih prioritas</option>
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-xs">Batas Waktu</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={formatDateInput(disposition.dueDate)} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="notes" className="text-xs">Catatan</Label>
              <Textarea id="notes" name="notes" defaultValue={disposition.notes ?? ""} className="min-h-20 rounded-md text-xs" />
            </div>
          </div>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Pencil className="size-4" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
