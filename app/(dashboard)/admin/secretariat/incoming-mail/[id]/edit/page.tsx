import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import { ActionForm } from "@/components/admin/shared/action-form";

import {
  getIncomingMailById,
  getMediaByFileId,
} from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";
import { updateIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";
import { uploadIncomingMailAttachment } from "@/modules/secretariat/presentation/secretariat.action";

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

  const attachmentFileId = mail.attachmentUrl
    ? extractFileIdFromMediaUrl(mail.attachmentUrl)
    : null;
  const attachmentMedia = attachmentFileId
    ? await getMediaByFileId(attachmentFileId)
    : null;

  return (
    <PageContainer>
      <PageHeader
        title={`Surat Masuk - ${mail.registrationNumber}`}
        description={`Pengirim: ${mail.sender} · Status: ${statusLabels[mail.status] ?? mail.status}`}
      />

      <ActionForm
        action={updateIncomingMail.bind(null, mail.id)}
        submitLabel="Simpan Perubahan"
        submitIcon={<Pencil className="size-4" />}
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
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Dokumen Surat Masuk</h2>
            <p className="text-xs text-muted-foreground">
              Unggah dokumen surat masuk.
            </p>
          </div>

          <AttachmentUpload
            uploadAction={uploadIncomingMailAttachment}
            initialAttachmentUrl={mail.attachmentUrl}
            initialFileName={attachmentMedia?.originalName}
          />
        </SectionCard>
      </ActionForm>
    </PageContainer>
  );
}
