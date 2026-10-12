import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";
import { CheckCircle, Pencil, Send, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import { ActionForm } from "@/components/admin/shared/action-form";

import {
  getAdministrativeDocumentById,
  getMediaByFileId,
  extractFileIdFromMediaUrl,
  updateAdministrativeDocument,
  transitionAdministrativeDocumentStatus,
  uploadAdministrativeDocumentAttachment,
} from "@/modules/secretariat";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Diajukan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  ARCHIVED: "Diarsipkan",
};

const documentTypes = [
  { value: "SURAT_KETERANGAN", label: "Surat Keterangan" },
  { value: "SURAT_TUGAS", label: "Surat Tugas" },
  { value: "SURAT_KEPUTUSAN", label: "Surat Keputusan" },
  { value: "SURAT_UNDANGAN", label: "Surat Undangan" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await getAdministrativeDocumentById(id);

  if (!doc) notFound();

  const attachmentFileId = doc.attachmentUrl
    ? extractFileIdFromMediaUrl(doc.attachmentUrl)
    : null;
  const attachmentMedia = attachmentFileId
    ? await getMediaByFileId(attachmentFileId)
    : null;

  const statusActions: {
    label: string;
    status: string;
    icon: typeof Send;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[] = [];
  if (doc.status === "DRAFT")
    statusActions.push({
      label: "Ajukan",
      status: "SUBMITTED",
      icon: Send,
      variant: "default",
    });
  if (doc.status === "SUBMITTED")
    statusActions.push({
      label: "Setujui",
      status: "APPROVED",
      icon: CheckCircle,
      variant: "default",
    });
  if (doc.status === "SUBMITTED")
    statusActions.push({
      label: "Tolak",
      status: "REJECTED",
      icon: XCircle,
      variant: "destructive",
    });

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Dokumen - ${doc.documentNumber}`}
        description={`${doc.title} · Status: ${statusLabels[doc.status] ?? doc.status}`}
      />

      <div className="flex flex-wrap gap-2">
        {statusActions.map((action) => {
          const Icon = action.icon;
          return (
            <form
              key={action.status}
              action={transitionAdministrativeDocumentStatus.bind(
                null,
                doc.id,
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
        action={updateAdministrativeDocument.bind(null, doc.id)}
        submitLabel="Simpan Perubahan"
        submitIcon={<Pencil className="size-4" />}
      >
        <Band variant="raised" title="Informasi Dokumen">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Nomor Dokumen">
              <Input
                id="documentNumber"
                name="documentNumber"
                required
                defaultValue={doc.documentNumber}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Jenis Dokumen">
              <NativeSelect
                id="documentType"
                name="documentType"
                required
                defaultValue={doc.documentType}
                className="h-9 w-full text-xs"
              >
                {documentTypes.map((t) => (
                  <NativeSelectOption key={t.value} value={t.value}>
                    {t.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>

            <FormGroup legend="Judul" className="md:col-span-2">
              <Input
                id="title"
                name="title"
                required
                defaultValue={doc.title}
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Deskripsi" className="md:col-span-2">
              <Textarea
                id="description"
                name="description"
                defaultValue={doc.description ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Konten" className="md:col-span-2">
              <Textarea
                id="content"
                name="content"
                defaultValue={doc.content ?? ""}
                className="min-h-32 rounded-md text-xs"
              />
            </FormGroup>
          </div>
        </Band>

        <Band variant="raised" title="Dokumen File" description="Unggah dokumen file. Jika diunggah, halaman cetak menampilkan file ini.">
          <AttachmentUpload
            uploadAction={uploadAdministrativeDocumentAttachment}
            initialAttachmentUrl={doc.attachmentUrl}
            initialFileName={attachmentMedia?.originalName}
          />
        </Band>
      </ActionForm>
    </PageContainer>
  );
}