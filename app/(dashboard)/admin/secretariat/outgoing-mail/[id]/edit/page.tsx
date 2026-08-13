import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Archive,
  CheckCircle,
  Lock,
  Printer,
  RotateCcw,
  Send,
  QrCode,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionForm } from "@/components/admin/shared/action-form";
import { SigningEditor } from "@/components/admin/secretariat/signing-editor";
import { SignerFields } from "@/components/admin/secretariat/signer-fields";

import {
  getOutgoingMailById,
  getMediaByFileId,
} from "@/modules/secretariat/queries/secretariat.query";
import {
  updateOutgoingMail,
  transitionOutgoingMailStatus,
} from "@/modules/secretariat/presentation/secretariat.action";
import { getLetterLevelOptions } from "@/modules/organization";
import { getCentralBoardSigners } from "@/modules/cms/queries/structure.query";
import { LETTER_TYPES } from "@/config/letter-types";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { extractFileIdFromMediaUrl } from "@/modules/secretariat/application/drive-archive.service";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Terkirim",
  ARCHIVED: "Diarsipkan",
};

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
  const [mail, levels, pengurus] = await Promise.all([
    getOutgoingMailById(id),
    getLetterLevelOptions(),
    getCentralBoardSigners(),
  ]);

  if (!mail) notFound();

  const attachmentFileId = mail.attachmentUrl
    ? extractFileIdFromMediaUrl(mail.attachmentUrl)
    : null;
  const attachmentMedia = attachmentFileId
    ? await getMediaByFileId(attachmentFileId)
    : null;

  const hasQr = Boolean(mail.qrFileId && mail.verificationCode);
  const isArchived = mail.status === "ARCHIVED";

  const statusActions: {
    label: string;
    status: string;
    icon: typeof Send;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[] = [];
  if (mail.status === "DRAFT")
    statusActions.push({
      label: "Tandai Terkirim",
      status: "SENT",
      icon: Send,
      variant: "default",
    });
  if (mail.status === "SENT") {
    statusActions.push({
      label: "Arsipkan",
      status: "ARCHIVED",
      icon: Archive,
      variant: "outline",
    });
    statusActions.push({
      label: "Kembalikan ke Draft",
      status: "DRAFT",
      icon: RotateCcw,
      variant: "secondary",
    });
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          mail.fullNumber ? `Surat Keluar — ${mail.fullNumber}` : "Surat Keluar"
        }
        description={`Status: ${statusLabels[mail.status] ?? mail.status}`}
      />

      {mail.fullNumber && (
        <div className="mt-2">
          <LetterPlate fullNumber={mail.fullNumber} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {statusActions.map((action) => {
          const Icon = action.icon;
          return (
            <form
              key={action.status}
              action={async () => {
                "use server";
                await transitionOutgoingMailStatus(mail.id, action.status);
              }}
            >
              <Button type="submit" variant={action.variant} size="sm">
                <Icon className="size-3.5" />
                {action.label}
              </Button>
            </form>
          );
        })}

        <Button variant="secondary" size="sm" asChild>
          <Link
            href={`/admin/secretariat/outgoing-mail/${mail.id}/cetak`}
            target="_blank"
          >
            <Printer className="size-3.5" />
            Cetak
          </Link>
        </Button>
      </div>

      {isArchived && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200">
          <Lock className="size-4 shrink-0" />
          Surat telah diarsipkan dan tidak dapat diubah.
        </div>
      )}

      {!isArchived && (
        <ActionForm
          action={updateOutgoingMail.bind(null, mail.id)}
          submitLabel="Simpan Perubahan"
          submitIcon={<CheckCircle className="size-4" />}
        >
          <SectionCard className="rounded-lg p-4">
            <div className="mb-4 border-b pb-3">
              <h2 className="text-base font-semibold">Informasi Surat</h2>
              <p className="text-xs text-muted-foreground">
                Mengubah tingkat atau kategori akan memutakhirkan nomor surat
                otomatis.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="levelCode" className="text-xs">
                  Tingkat Kepengurusan
                </Label>
                <NativeSelect
                  id="levelCode"
                  name="levelCode"
                  className="w-full"
                  defaultValue={mail.levelCode ?? ""}
                >
                  <NativeSelectOption value="">
                    Pilih tingkat
                  </NativeSelectOption>
                  {levels.map((level) => (
                    <NativeSelectOption key={level.code} value={level.code}>
                      {level.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="categoryCode" className="text-xs">
                  Kategori Surat
                </Label>
                <NativeSelect
                  id="categoryCode"
                  name="categoryCode"
                  className="w-full"
                  defaultValue={mail.categoryCode ?? ""}
                >
                  <NativeSelectOption value="">
                    Pilih kategori
                  </NativeSelectOption>
                  {LETTER_TYPES.map((type) => (
                    <NativeSelectOption key={type.key} value={type.key}>
                      {type.key} — {type.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
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
                  defaultValue={formatDateInput(mail.mailDate)}
                  className="rounded-md text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recipient" className="text-xs">
                  Penerima
                </Label>
                <Input
                  id="recipient"
                  name="recipient"
                  defaultValue={mail.recipient ?? ""}
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
                  defaultValue={mail.subject}
                  className="rounded-md text-xs"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="rounded-lg p-4">
            <div className="mb-4 border-b pb-3">
              <h2 className="text-base font-semibold">QR Penanda Tangan</h2>
              <p className="text-xs text-muted-foreground">
                Nama & jabatan Ketua dan Sekretaris diambil dari struktur
                Pengurus Pusat dan dijadikan konten QR yang ditempel pada
                dokumen saat surat ditandai terkirim.
              </p>
            </div>

            <SignerFields
              pengurus={pengurus}
              initialKetuaName={mail.ketuaName}
              initialKetuaPosition={mail.ketuaPosition}
              initialSekretarisName={mail.sekretarisName}
              initialSekretarisPosition={mail.sekretarisPosition}
            />
          </SectionCard>

          <SectionCard className="rounded-lg p-4">
            <div className="mb-4 border-b pb-3">
              <h2 className="text-base font-semibold">Dokumen Surat</h2>
              <p className="text-xs text-muted-foreground">
                Unggah dokumen surat, lalu atur posisi QR Ketua, Sekretaris,
                dan Verifikasi pada halaman dokumen.
              </p>
            </div>

            <SigningEditor
              initialAttachmentUrl={mail.attachmentUrl ?? null}
              initialFileName={attachmentMedia?.originalName ?? null}
              initialKetuaPosition={mail.qrKetuaPosition}
              initialSekretarisPosition={mail.qrSekretarisPosition}
              initialVerifikasiPosition={mail.qrVerifikasiPosition}
            />
            </SectionCard>
          </ActionForm>
        )}

      <div className="mt-4 max-w-2xl">
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">QR Verifikasi</h2>
            <p className="text-xs text-muted-foreground">
              QR diterbitkan otomatis saat surat ditandai terkirim. Pihak luar
              bisa memverifikasi dengan scan QR atau memasukkan nomor surat.
            </p>
          </div>

          {hasQr ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="flex size-32 items-center justify-center rounded-lg border bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/media/${mail.qrFileId}?mime=image/png`}
                  alt="QR Verifikasi"
                  className="size-full"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium">Nomor verifikasi</p>
                <p className="mt-0.5 break-all text-xs text-muted-foreground">
                  {mail.verificationCode}
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link
                    href={`/verifikasi/surat/${encodeURIComponent(mail.verificationCode ?? "")}`}
                    target="_blank"
                  >
                    Lihat halaman verifikasi
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-6">
              <QrCode className="size-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                QR belum tersedia. Tandai surat sebagai terkirim untuk
                menerbitkan nomor dan QR verifikasi.
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  );
}
