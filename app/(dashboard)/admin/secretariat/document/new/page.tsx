import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";

import { createAdministrativeDocument } from "@/modules/secretariat/presentation/secretariat.action";
import { uploadAdministrativeDocumentAttachment } from "@/modules/secretariat/presentation/secretariat.action";

const documentTypes = [
  { value: "SURAT_KETERANGAN", label: "Surat Keterangan" },
  { value: "SURAT_TUGAS", label: "Surat Tugas" },
  { value: "SURAT_KEPUTUSAN", label: "Surat Keputusan" },
  { value: "SURAT_UNDANGAN", label: "Surat Undangan" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default function NewDocumentPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dokumen Administrasi Baru"
        description="Lengkapi informasi dokumen administrasi."
      />

      <form
        action={createAdministrativeDocument}
        className="max-w-2xl space-y-3"
      >
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Dokumen</h2>
            <p className="text-xs text-muted-foreground">
              Data utama dokumen administrasi.
            </p>
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
                placeholder="DOC-2027-001"
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
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih jenis</option>
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
                placeholder="Judul dokumen"
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
                className="min-h-20 rounded-md text-xs"
                placeholder="Deskripsi dokumen (opsional)"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="content" className="text-xs">
                Konten
              </Label>
              <Textarea
                id="content"
                name="content"
                className="min-h-32 rounded-md text-xs"
                placeholder="Konten dokumen (opsional)"
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
          />
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            Simpan Dokumen
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
