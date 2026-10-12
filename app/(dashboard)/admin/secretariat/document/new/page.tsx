import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import { ActionForm } from "@/components/admin/shared/action-form";

import {
  createAdministrativeDocument,
  uploadAdministrativeDocumentAttachment,
} from "@/modules/secretariat";

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

      <ActionForm
        action={createAdministrativeDocument}
        submitLabel="Simpan Dokumen"
        submitIcon={<Plus className="size-4" />}
      >
        <Band variant="raised" title="Informasi Dokumen" description="Data utama dokumen administrasi.">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Nomor Dokumen">
              <Input
                id="documentNumber"
                name="documentNumber"
                required
                placeholder="DOC-2027-001"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Jenis Dokumen">
              <NativeSelect
                id="documentType"
                name="documentType"
                required
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih jenis</NativeSelectOption>
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
                placeholder="Judul dokumen"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Deskripsi" className="md:col-span-2">
              <Textarea
                id="description"
                name="description"
                className="min-h-20 rounded-md text-xs"
                placeholder="Deskripsi dokumen (opsional)"
              />
            </FormGroup>

            <FormGroup legend="Konten" className="md:col-span-2">
              <Textarea
                id="content"
                name="content"
                className="min-h-32 rounded-md text-xs"
                placeholder="Konten dokumen (opsional)"
              />
            </FormGroup>
          </div>
        </Band>

        <Band variant="raised" title="Dokumen File" description="Unggah dokumen file. Jika diunggah, halaman cetak menampilkan file ini.">
          <AttachmentUpload uploadAction={uploadAdministrativeDocumentAttachment} />
        </Band>
      </ActionForm>
    </PageContainer>
  );
}