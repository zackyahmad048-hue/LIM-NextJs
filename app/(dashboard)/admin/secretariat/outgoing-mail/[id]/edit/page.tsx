import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Archive,
  CheckCircle,
  FileDown,
  Printer,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const validationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/surat/${mail.id}`;

  return (
    <PageContainer>
      <PageHeader
        title={`Surat Keluar - ${mail.registrationNumber}`}
        description={`Status: ${statusLabels[mail.status] ?? mail.status}`}
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

        <Button variant="secondary" size="sm" asChild>
          <Link href={`/admin/secretariat/outgoing-mail/${mail.id}/cetak`} target="_blank">
            <Printer className="size-3.5" />
            Cetak
          </Link>
        </Button>
      </div>

      <form action={updateOutgoingMail.bind(null, mail.id)} className="max-w-2xl space-y-3">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Surat</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="registrationNumber" className="text-xs">Nomor Surat</Label>
              <Input id="registrationNumber" name="registrationNumber" required defaultValue={mail.registrationNumber} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mailDate" className="text-xs">Tanggal Surat</Label>
              <Input id="mailDate" name="mailDate" type="date" required defaultValue={formatDateInput(mail.mailDate)} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="recipient" className="text-xs">Penerima</Label>
              <Input id="recipient" name="recipient" defaultValue={mail.recipient ?? ""} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="subject" className="text-xs">Perihal Surat</Label>
              <Input id="subject" name="subject" required defaultValue={mail.subject} className="rounded-md text-xs" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="documentType" className="text-xs">Jenis Surat</Label>
              <NativeSelect id="documentType" name="documentType" className="w-full" defaultValue={mail.documentType ?? ""}>
                <NativeSelectOption value="">Pilih jenis surat</NativeSelectOption>
                {letterTypes.map((t) => (
                  <NativeSelectOption key={t.value} value={t.value}>{t.label}</NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="senderName" className="text-xs">Penanda Tangan</Label>
              <Input id="senderName" name="senderName" defaultValue={mail.senderName ?? ""} className="rounded-md text-xs" />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Isi Surat</h2>
            <p className="text-xs text-muted-foreground">
              Edit konten template surat keluar.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs">Konten Surat</Label>
            <Textarea
              id="content"
              name="content"
              rows={16}
              defaultValue={mail.content ?? ""}
              className="rounded-md text-xs font-mono leading-relaxed"
            />
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">QR Code Validasi</h2>
            <p className="text-xs text-muted-foreground">
              Scan QR untuk memvalidasi keaslian surat.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex size-32 items-center justify-center rounded-lg border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(validationUrl)}`}
                alt="QR Code Validasi"
                className="size-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium">URL Validasi</p>
              <p className="mt-0.5 break-all text-xs text-muted-foreground">
                {validationUrl}
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href={`/admin/secretariat/outgoing-mail/${mail.id}/cetak`} target="_blank">
                  <FileDown className="size-3.5" />
                  Cetak / PDF
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="sm">
            <CheckCircle className="size-4" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
