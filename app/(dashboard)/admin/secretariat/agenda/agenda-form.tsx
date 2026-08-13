"use client";

import { useActionState } from "react";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionResultMessage } from "@/components/admin/shared/action-result-message";
import {
  INITIAL_ACTION_RESULT,
  type ActionResult,
} from "@/modules/shared/presentation/action-result";

interface AgendaFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  initial?: {
    date: string;
    title: string;
    description?: string;
    location?: string;
    participants?: string;
    notes?: string;
  };
}

export function AgendaForm({ action, submitLabel, initial }: AgendaFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    INITIAL_ACTION_RESULT,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-3">
      <SectionCard className="rounded-lg p-4">
        <div className="mb-4 border-b pb-3">
          <h2 className="text-base font-semibold">Informasi Agenda</h2>
          <p className="text-xs text-muted-foreground">
            Rapat, kegiatan, atau jadwal kerja organisasi.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs">
              Tanggal
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={initial?.date}
              className="rounded-md text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs">
              Lokasi
            </Label>
            <Input
              id="location"
              name="location"
              defaultValue={initial?.location ?? ""}
              className="rounded-md text-xs"
              placeholder="Ruang rapat, online, dsb. (opsional)"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="title" className="text-xs">
              Judul
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={initial?.title}
              className="rounded-md text-xs"
              placeholder="Rapat Pengurus Harian"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="description" className="text-xs">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
              className="min-h-20 rounded-md text-xs"
              placeholder="Agenda dan tujuan kegiatan (opsional)"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="participants" className="text-xs">
              Peserta
            </Label>
            <Textarea
              id="participants"
              name="participants"
              defaultValue={initial?.participants ?? ""}
              className="min-h-16 rounded-md text-xs"
              placeholder="Daftar peserta yang diundang (opsional)"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="notes" className="text-xs">
              Catatan
            </Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={initial?.notes ?? ""}
              className="min-h-16 rounded-md text-xs"
              placeholder="Catatan tambahan (opsional)"
            />
          </div>
        </div>
      </SectionCard>

      <ActionResultMessage state={state} />

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          <CalendarPlus className="size-4" />
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
