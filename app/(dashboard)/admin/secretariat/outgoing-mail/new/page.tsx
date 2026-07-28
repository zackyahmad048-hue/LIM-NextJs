import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { createOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";

const documentTypes = [
  { value: "SURAT_KETERANGAN", label: "Surat Keterangan" },
  { value: "SURAT_TUGAS", label: "Surat Tugas" },
  { value: "SURAT_KEPUTUSAN", label: "Surat Keputusan" },
  { value: "SURAT_UNDANGAN", label: "Surat Undangan" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default function NewOutgoingMailPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Surat Keluar Baru"
        description="Lengkapi informasi surat keluar."
      />

      <form action={createOutgoingMail} className="max-w-2xl space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Surat Keluar</h2>
            <p className="text-xs text-muted-foreground">
              Data utama surat keluar.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-xs">Nomor Registrasi</Label>
              <Input id="registrationNumber" name="registrationNumber" required placeholder="SK-2027-001" className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mailDate" className="text-xs">Tanggal Surat</Label>
              <Input id="mailDate" name="mailDate" type="date" required className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="recipient" className="text-xs">Penerima</Label>
              <Input id="recipient" name="recipient" required placeholder="Nama penerima" className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subject" className="text-xs">Perihal</Label>
              <Input id="subject" name="subject" required placeholder="Perihal surat" className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senderName" className="text-xs">Nama Pengirim</Label>
              <Input id="senderName" name="senderName" placeholder="Nama pengirim (opsional)" className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentNumber" className="text-xs">Nomor Dokumen</Label>
              <Input id="documentNumber" name="documentNumber" placeholder="Nomor dokumen (opsional)" className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentType" className="text-xs">Jenis Dokumen</Label>
              <NativeSelect id="documentType" name="documentType" className="w-full">
                <NativeSelectOption value="">Pilih jenis</NativeSelectOption>
                {documentTypes.map((t) => (
                  <NativeSelectOption key={t.value} value={t.value}>{t.label}</NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="attachmentUrl" className="text-xs">URL Lampiran</Label>
              <Input id="attachmentUrl" name="attachmentUrl" placeholder="URL lampiran (opsional)" className="rounded-md text-xs" />
            </div>
          </div>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            Simpan Surat Keluar
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
