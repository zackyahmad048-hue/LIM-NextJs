import { notFound } from "next/navigation";
import { CheckCircle, Pencil, Send, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";

import {
  getAdministrativeDocumentById,
  getMediaByFileId,
} from "@/modules/secretariat/queries/secretariat.query";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";
import {
  updateAdministrativeDocument,
  transitionAdministrativeDocumentStatus,
  uploadAdministrativeDocumentAttachment,
} from "@/modules/secretariat/presentation/secretariat.action";

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

      <form
        action={updateAdministrativeDocument.bind(null, doc.id)}
        className="max-w-2xl space-y-3"
      >
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Dokumen</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="documentNumber" className="text-xs">
                Nomor Dokumen
              </Label>
              <Input
                id="documentNumber"
                name="documentNumber"
                required
                defaultValue={doc.documentNumber}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentType" className="text-xs">
                Jenis Dokumen
              </Label>
              <select
                id="documentType"
                name="documentType"
                required
                defaultValue={doc.documentType}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                {documentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title" className="text-xs">
                Judul
              </Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={doc.title}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description" className="text-xs">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={doc.description ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="content" className="text-xs">
                Konten
              </Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={doc.content ?? ""}
                className="min-h-32 rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Dokumen File</h2>
            <p className="text-xs text-muted-foreground">
              Unggah dokumen file. Jika diunggah, halaman cetak menampilkan file
              ini.
            </p>
          </div>

          <AttachmentUpload
            uploadAction={uploadAdministrativeDocumentAttachment}
            initialAttachmentUrl={doc.attachmentUrl}
            initialFileName={attachmentMedia?.originalName}
          />
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
