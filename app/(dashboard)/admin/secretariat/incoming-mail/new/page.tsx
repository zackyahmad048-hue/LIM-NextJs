import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { createIncomingMail } from "@/modules/secretariat/presentation/secretariat.action";

export default function NewIncomingMailPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Surat Masuk Baru"
        description="Lengkapi informasi surat masuk."
      />

      <form action={createIncomingMail} className="max-w-2xl space-y-3">
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
                placeholder="Contoh: 12/B/UM/2026"
                className="rounded-md text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Nomor sesuai lembar asli yang dikirim pihak luar.
              </p>
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
                placeholder="Nama pengirim"
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
                placeholder="Alamat pengirim (opsional)"
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
                placeholder="Perihal surat"
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
                placeholder="Klasifikasi (opsional)"
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
                placeholder="Kategori (opsional)"
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
                className="min-h-20 rounded-md text-xs"
                placeholder="Catatan (opsional)"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="attachmentUrl" className="text-xs">
                URL Lampiran
              </Label>
              <Input
                id="attachmentUrl"
                name="attachmentUrl"
                placeholder="URL lampiran (opsional)"
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            Simpan Surat Masuk
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
