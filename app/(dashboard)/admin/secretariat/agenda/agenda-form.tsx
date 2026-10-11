"use client";

import { useActionState } from "react";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
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
      <Band variant="raised" title="Informasi Agenda" description="Rapat, kegiatan, atau jadwal kerja organisasi.">
        <div className="grid gap-3 md:grid-cols-2">
          <FormGroup legend="Tanggal">
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={initial?.date}
              className="rounded-md text-xs"
            />
          </FormGroup>

          <FormGroup legend="Lokasi">
            <Input
              id="location"
              name="location"
              defaultValue={initial?.location ?? ""}
              className="rounded-md text-xs"
              placeholder="Ruang rapat, online, dsb. (opsional)"
            />
          </FormGroup>

          <FormGroup legend="Judul" className="md:col-span-2">
            <Input
              id="title"
              name="title"
              required
              defaultValue={initial?.title}
              className="rounded-md text-xs"
              placeholder="Rapat Pengurus Harian"
            />
          </FormGroup>

          <FormGroup legend="Deskripsi" className="md:col-span-2">
            <Textarea
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
              className="min-h-20 rounded-md text-xs"
              placeholder="Agenda dan tujuan kegiatan (opsional)"
            />
          </FormGroup>

          <FormGroup legend="Peserta" className="md:col-span-2">
            <Textarea
              id="participants"
              name="participants"
              defaultValue={initial?.participants ?? ""}
              className="min-h-16 rounded-md text-xs"
              placeholder="Daftar peserta yang diundang (opsional)"
            />
          </FormGroup>

          <FormGroup legend="Catatan" className="md:col-span-2">
            <Textarea
              id="notes"
              name="notes"
              defaultValue={initial?.notes ?? ""}
              className="min-h-16 rounded-md text-xs"
              placeholder="Catatan tambahan (opsional)"
            />
          </FormGroup>
        </div>
      </Band>

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