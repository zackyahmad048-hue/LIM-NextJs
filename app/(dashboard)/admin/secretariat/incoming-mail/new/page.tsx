import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { AttachmentUpload } from "@/components/admin/shared/attachment-upload";
import { ActionForm } from "@/components/admin/shared/action-form";

import { createIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";
import { uploadIncomingMailAttachment } from "@/modules/secretariat/presentation/secretariat.action";

export default function NewIncomingMailPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Surat Masuk Baru"
        description="Lengkapi informasi surat masuk."
      />

      <ActionForm action={createIncomingMail} submitLabel="Simpan Surat Masuk" submitIcon={<Plus className="size-4" />}>
        <Band variant="raised" title="Informasi Surat Masuk" description="Surat masuk otomatis diarsipkan saat disimpan.">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Nomor Surat Pengirim">
              <Input
                id="registrationNumber"
                name="registrationNumber"
                required
                placeholder="Contoh: 12/B/UM/2026"
                className="rounded-md text-xs"
              />
              <p className="text-[11px] text-admin-content-fg/60">
                Nomor sesuai lembar asli yang dikirim pihak luar.
              </p>
            </FormGroup>

            <FormGroup legend="Tanggal Diterima">
              <Input
                id="receivedDate"
                name="receivedDate"
                type="date"
                required
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Pengirim" className="md:col-span-2">
              <Input
                id="sender"
                name="sender"
                required
                placeholder="Nama pengirim"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Alamat Pengirim" className="md:col-span-2">
              <Input
                id="senderAddress"
                name="senderAddress"
                placeholder="Alamat pengirim (opsional)"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Perihal" className="md:col-span-2">
              <Input
                id="subject"
                name="subject"
                required
                placeholder="Perihal surat"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Klasifikasi">
              <Input
                id="classification"
                name="classification"
                placeholder="Klasifikasi (opsional)"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Kategori">
              <Input
                id="category"
                name="category"
                placeholder="Kategori (opsional)"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Catatan" className="md:col-span-2">
              <Textarea
                id="notes"
                name="notes"
                className="min-h-20 rounded-md text-xs"
                placeholder="Catatan (opsional)"
              />
            </FormGroup>
          </div>
        </Band>

        <Band variant="raised" title="Dokumen Surat Masuk" description="Unggah dokumen surat masuk.">
          <AttachmentUpload uploadAction={uploadIncomingMailAttachment} />
        </Band>
      </ActionForm>
    </PageContainer>
  );
}