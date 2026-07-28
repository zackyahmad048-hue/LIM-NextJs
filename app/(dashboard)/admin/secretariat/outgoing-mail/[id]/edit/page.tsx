import { notFound } from "next/navigation";
import {
  Archive,
  CheckCircle,
  Pencil,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";

import { getOutgoingMailById } from "@/modules/secretariat/queries/secretariat.query";
import { updateOutgoingMail, transitionOutgoingMailStatus } from "@/modules/secretariat/presentation/secretariat.action";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  APPROVED: "Disetujui",
  SENT: "Terkirim",
  ARCHIVED: "Diarsipkan",
};

const documentTypes = [
  { value: "SURAT_KETERANGAN", label: "Surat Keterangan" },
  { value: "SURAT_TUGAS", label: "Surat Tugas" },
  { value: "SURAT_KEPUTUSAN", label: "Surat Keputusan" },
  { value: "SURAT_UNDANGAN", label: "Surat Undangan" },
  { value: "LAINNYA", label: "Lainnya" },
];

function formatDateInput(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default async function EditOutgoingMailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mail = await getOutgoingMailById(id);

  if (!mail) notFound();

  const statusActions: { label: string; status: string; icon: typeof Send; variant: "default" | "secondary" | "destructive" | "outline" }[] = [];
  if (mail.status === "DRAFT") statusActions.push({ label: "Setujui", status: "APPROVED", icon: CheckCircle, variant: "default" });
  if (mail.status === "APPROVED") statusActions.push({ label: "Kirim", status: "SENT", icon: Send, variant: "default" });
  if (["SENT", "APPROVED"].includes(mail.status)) statusActions.push({ label: "Arsipkan", status: "ARCHIVED", icon: Archive, variant: "outline" });

  return (
    <PageContainer>
      <PageHeader
        title={`Surat Keluar - ${mail.registrationNumber}`}
        description={`Penerima: ${mail.recipient} · Status: ${statusLabels[mail.status] ?? mail.status}`}
      />

      <div className="flex flex-wrap gap-2">
        {statusActions.map((action) => {
          const Icon = action.icon;
          return (
            <form key={action.status} action={transitionOutgoingMailStatus.bind(null, mail.id, action.status)}>
              <Button type="submit" variant={action.variant} size="sm">
                <Icon className="size-3.5" />
                {action.label}
              </Button>
            </form>
          );
        })}
      </div>

      <form action={updateOutgoingMail.bind(null, mail.id)} className="max-w-2xl space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Surat Keluar</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-xs">Nomor Registrasi</Label>
              <Input id="registrationNumber" name="registrationNumber" required defaultValue={mail.registrationNumber} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mailDate" className="text-xs">Tanggal Surat</Label>
              <Input id="mailDate" name="mailDate" type="date" required defaultValue={formatDateInput(mail.mailDate)} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="recipient" className="text-xs">Penerima</Label>
              <Input id="recipient" name="recipient" required defaultValue={mail.recipient} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subject" className="text-xs">Perihal</Label>
              <Input id="subject" name="subject" required defaultValue={mail.subject} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senderName" className="text-xs">Nama Pengirim</Label>
              <Input id="senderName" name="senderName" defaultValue={mail.senderName ?? ""} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentNumber" className="text-xs">Nomor Dokumen</Label>
              <Input id="documentNumber" name="documentNumber" defaultValue={mail.documentNumber ?? ""} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="documentType" className="text-xs">Jenis Dokumen</Label>
              <NativeSelect id="documentType" name="documentType" className="w-full" defaultValue={mail.documentType ?? ""}>
                <NativeSelectOption value="">Pilih jenis</NativeSelectOption>
                {documentTypes.map((t) => (
                  <NativeSelectOption key={t.value} value={t.value}>{t.label}</NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="attachmentUrl" className="text-xs">URL Lampiran</Label>
              <Input id="attachmentUrl" name="attachmentUrl" defaultValue={mail.attachmentUrl ?? ""} className="rounded-md text-xs" />
            </div>
          </div>
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
