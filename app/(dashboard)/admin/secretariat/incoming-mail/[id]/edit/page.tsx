import { formatDateInput } from "@/lib/format";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import { ActionForm } from "@/components/admin/shared/action-form";
import { ArchiveIncomingMailButton } from "@/components/admin/secretariat/archive-incoming-mail-button";

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
        actions={
          mail.status !== "ARCHIVED" ? (
            <ArchiveIncomingMailButton
              id={mail.id}
              subject={mail.subject}
              label="Arsipkan"
              variant="outline"
            />
          ) : undefined
        }
      />

      <ActionForm
        action={updateIncomingMail.bind(null, mail.id)}
        submitLabel="Simpan Perubahan"
        submitIcon={<Pencil className="size-4" />}
      >
        <Band variant="raised" title="Informasi Surat Masuk">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Nomor Surat Pengirim">
              <Input
                id="registrationNumber"
                name="registrationNumber"
                required
                defaultValue={mail.registrationNumber}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Tanggal Diterima">
              <Input
                id="receivedDate"
                name="receivedDate"
                type="date"
                required
                defaultValue={formatDateInput(mail.receivedDate)}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Pengirim" className="md:col-span-2">
              <Input
                id="sender"
                name="sender"
                required
                defaultValue={mail.sender}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Alamat Pengirim" className="md:col-span-2">
              <Input
                id="senderAddress"
                name="senderAddress"
                defaultValue={mail.senderAddress ?? ""}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Perihal" className="md:col-span-2">
              <Input
                id="subject"
                name="subject"
                required
                defaultValue={mail.subject}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Klasifikasi">
              <Input
                id="classification"
                name="classification"
                defaultValue={mail.classification ?? ""}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Kategori">
              <Input
                id="category"
                name="category"
                defaultValue={mail.category ?? ""}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Catatan" className="md:col-span-2">
              <Textarea
                id="notes"
                name="notes"
                defaultValue={mail.notes ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </FormGroup>
          </div>
        </Band>

        <Band variant="raised" title="Dokumen Surat Masuk" description="Unggah dokumen surat masuk.">
          <AttachmentUpload
            uploadAction={uploadIncomingMailAttachment}
            initialAttachmentUrl={mail.attachmentUrl}
            initialFileName={attachmentMedia?.originalName}
          />
        </Band>
      </ActionForm>
    </PageContainer>
  );
}