import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { createOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";

const letterTypes = [
  { value: "UNDANGAN", label: "Undangan" },
  { value: "PERMOHONAN", label: "Permohonan" },
  { value: "PEMBERITAHUAN", label: "Pemberitahuan" },
  { value: "INSTRUKSI", label: "Instruksi" },
  { value: "KETERANGAN", label: "Keterangan" },
  { value: "KEPUTUSAN", label: "Keputusan" },
  { value: "TERIMA_KASIH", label: "Terima Kasih" },
  { value: "LAINNYA", label: "Lain-lain" },
];

export default function NewOutgoingMailPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Surat Keluar Baru"
        description="Lengkapi informasi dan isi surat keluar."
      />

      <form action={createOutgoingMail} className="max-w-2xl space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Surat</h2>
            <p className="text-xs text-muted-foreground">
              Data utama surat keluar.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-xs">
                Nomor Surat
              </Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                required
                placeholder="00/A/LIM-P2L/00/0000"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mailDate" className="text-xs">
                Tanggal Surat
              </Label>
              <Input
                id="mailDate"
                name="mailDate"
                type="date"
                required
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="recipient" className="text-xs">
                Penerima
              </Label>
              <Input
                id="recipient"
                name="recipient"
                placeholder="Nama penerima surat"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subject" className="text-xs">
                Perihal Surat
              </Label>
              <Input
                id="subject"
                name="subject"
                required
                placeholder="Perihal surat"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="documentType" className="text-xs">
                Jenis Surat
              </Label>
              <NativeSelect
                id="documentType"
                name="documentType"
                className="w-full"
              >
                <NativeSelectOption value="">
                  Pilih jenis surat
                </NativeSelectOption>
                {letterTypes.map((t) => (
                  <NativeSelectOption key={t.value} value={t.value}>
                    {t.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="senderName" className="text-xs">
                Penanda Tangan
              </Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="Nama penanda tangan surat"
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Isi Surat</h2>
            <p className="text-xs text-muted-foreground">
              Konten template surat keluar.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs">
              Konten Surat
            </Label>
            <Textarea
              id="content"
              name="content"
              rows={16}
              placeholder="Isi surat..."
              className="rounded-md text-xs font-mono leading-relaxed"
            />
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
