import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { getIncomingMailById } from "@/modules/secretariat/queries/secretariat.query";
import { updateIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

const statusLabels: Record<string, string> = {
  RECEIVED: "Diterima",
  ARCHIVED: "Diarsipkan",
};

function formatDateInput(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default async function EditIncomingMailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mail = await getIncomingMailById(id);

  if (!mail) notFound();

  return (
    <PageContainer>
      <PageHeader
        title={`Surat Masuk - ${mail.registrationNumber}`}
        description={`Pengirim: ${mail.sender} · Status: ${statusLabels[mail.status] ?? mail.status}`}
      />

      <form
        action={updateIncomingMail.bind(null, mail.id)}
        className="max-w-2xl space-y-3"
      >
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Surat Masuk</h2>
            <p className="text-xs text-muted-foreground">
              Surat masuk otomatis diarsipkan saat disimpan.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-xs">
                Nomor Surat Pengirim
              </Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                required
                defaultValue={mail.registrationNumber}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receivedDate" className="text-xs">
                Tanggal Diterima
              </Label>
              <Input
                id="receivedDate"
                name="receivedDate"
                type="date"
                required
                defaultValue={formatDateInput(mail.receivedDate)}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="sender" className="text-xs">
                Pengirim
              </Label>
              <Input
                id="sender"
                name="sender"
                required
                defaultValue={mail.sender}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="senderAddress" className="text-xs">
                Alamat Pengirim
              </Label>
              <Input
                id="senderAddress"
                name="senderAddress"
                defaultValue={mail.senderAddress ?? ""}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subject" className="text-xs">
                Perihal
              </Label>
              <Input
                id="subject"
                name="subject"
                required
                defaultValue={mail.subject}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="classification" className="text-xs">
                Klasifikasi
              </Label>
              <Input
                id="classification"
                name="classification"
                defaultValue={mail.classification ?? ""}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs">
                Kategori
              </Label>
              <Input
                id="category"
                name="category"
                defaultValue={mail.category ?? ""}
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
                defaultValue={mail.notes ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="attachmentUrl" className="text-xs">
                URL Lampiran
              </Label>
              <Input
                id="attachmentUrl"
                name="attachmentUrl"
                defaultValue={mail.attachmentUrl ?? ""}
                className="rounded-md text-xs"
              />
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
