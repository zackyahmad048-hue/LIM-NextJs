"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileUp,
  Trash2,
  QrCode,
  BadgeCheck,
  FileText,
  Archive,
  Inbox,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { LETTER_TYPES } from "@/config/letter-types";
import { getLetterTypeLabel } from "@/config/letter-types";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const statusLabels: Record<string, { label: string; variant: any }> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  PROCESSED: { label: "Diproses", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
  DRAFT: { label: "Draft", variant: "outline" },
  APPROVED: { label: "Disetujui", variant: "default" },
  SENT: { label: "Terkirim", variant: "secondary" },
};

interface VerifiedLetterItem {
  id: string;
  verificationCode: string;
  registrationNumber: string;
  subject: string;
  letterType: string;
  date: Date | string;
  issuer: string | null;
  qrPngUrl: string;
  processedPdfUrl: string;
  fileName: string;
  createdAt: Date | string;
}

interface IncomingItem {
  id: string;
  registrationNumber: string;
  sender: string;
  subject: string;
  receivedDate: Date | string;
  status: string;
}

interface OutgoingItem {
  id: string;
  registrationNumber: string;
  recipient: string;
  subject: string;
  mailDate: Date | string;
  status: string;
}

interface ArchiveItem {
  id: string;
  archiveNumber: string;
  title: string;
  documentType: string;
  category: string | null;
  archivedAt: Date | string;
}

interface SuratMenyuratClientProps {
  verifiedLetters: VerifiedLetterItem[];
  verifiedTotal: number;
  outgoingItems: OutgoingItem[];
  outgoingTotal: number;
  incomingItems: IncomingItem[];
  incomingTotal: number;
  archives: ArchiveItem[];
  archivesTotal: number;
}

const sectionLinks = [
  { href: "#buat", label: "Buat Surat", icon: FileUp },
  { href: "#keluar", label: "Surat Keluar", icon: Send },
  { href: "#masuk", label: "Surat Masuk", icon: Inbox },
  { href: "#arsip", label: "Arsip", icon: Archive },
];

function SectionHeading({
  id,
  index,
  title,
  count,
  children,
}: {
  id: string;
  index: string;
  title: string;
  count: number;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-dashed pt-8">
      <div className="flex items-end justify-between gap-4 border-b pb-4">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {index}
          </span>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {count}
          </span>
        </div>
        {children}
      </div>
    </section>
  );
}

function Row({
  left,
  right,
}: {
  left: { line1: string; line2?: string; mono?: boolean };
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <p
          className={`truncate text-sm ${left.mono ? "font-mono text-xs tabular-nums text-muted-foreground" : "font-medium"}`}
        >
          {left.line1}
        </p>
        {left.line2 && (
          <p className="truncate text-xs text-muted-foreground">{left.line2}</p>
        )}
      </div>
      {right}
    </div>
  );
}

function useVerifiedLetterDelete(router: ReturnType<typeof useRouter>) {
  return async function handleDelete(id: string) {
    const confirmDelete = window.confirm("Hapus surat beserta QR-nya?");
    if (!confirmDelete) return;

    const { deleteVerifiedLetterAction } = await import(
      "@/modules/secretariat/presentation/verified-letter.action"
    );
    const result = await deleteVerifiedLetterAction(id);
    if (result.success) {
      toast.success("Surat berhasil dihapus.");
    } else {
      toast.error(result.error ?? "Gagal menghapus surat.");
    }
    router.refresh();
  };
}

export function SuratMenyuratClient({
  verifiedLetters,
  verifiedTotal,
  outgoingItems,
  outgoingTotal,
  incomingItems,
  incomingTotal,
  archives,
  archivesTotal,
}: SuratMenyuratClientProps) {
  const router = useRouter();
  const deleteVerifiedLetter = useVerifiedLetterDelete(router);

  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      const { createVerifiedLetterAction } = await import(
        "@/modules/secretariat/presentation/verified-letter.action"
      );
      const result = await createVerifiedLetterAction(formData);
      if (result.success) {
        toast.success("Surat diproses. QR berhasil dibuat.");
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();
      } else {
        toast.error(result.error ?? "Gagal membuat surat.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Surat-menyurat"
        description="Terbitkan surat dengan QR verifikasi, pantau surat masuk & keluar, dan kelola arsip."
      />

      <nav className="sticky top-0 z-10 -mx-4 mt-6 border-y bg-background/95 px-4 backdrop-blur">
        <ul className="flex gap-1 overflow-x-auto py-2">
          {sectionLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <link.icon className="size-3.5" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Buat Surat */}
      <SectionHeading id="buat" index="01" title="Buat Surat" count={verifiedTotal}>
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <QrCode className="size-3.5" />
          QR otomatis disematkan di footer
        </span>
      </SectionHeading>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <form
          action={handleSubmit}
          className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:col-span-2"
        >
          <div>
            <label className="text-sm font-medium" htmlFor="letterType">
              Jenis Surat
            </label>
            <select
              id="letterType"
              name="letterType"
              required
              className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih jenis surat…</option>
              {LETTER_TYPES.map((type) => (
                <option key={type.key} value={type.key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="registrationNumber">
                Nomor Surat
              </label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                required
                placeholder="0000/PP/X/MM/XXXX"
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="date">
                Tanggal Surat
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="subject">
              Perihal
            </label>
            <input
              id="subject"
              name="subject"
              required
              placeholder="Permohonan izin kegiatan…"
              className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="issuer">
              Penerbit <span className="text-muted-foreground">(opsional)</span>
            </label>
            <input
              id="issuer"
              name="issuer"
              placeholder="Dewan Pimpinan Pusat LIM"
              className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="file">
              File Surat
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF/gambar (maks. 2 MB): QR disematkan langsung. DOC/DOCX:
              disimpan sebagai arsip mentah.
            </p>
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              required
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? "")
              }
              className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
            />
            {fileName && (
              <p className="mt-1.5 truncate font-mono text-xs text-muted-foreground">
                {fileName}
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Memproses…
              </>
            ) : (
              <>
                <FileUp className="size-4" />
                Terbitkan & Buat QR
              </>
            )}
          </Button>
        </form>

        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border shadow-sm">
            {verifiedLetters.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <QrCode className="size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">Belum ada surat diterbitkan</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Surat yang diterbitkan akan muncul di sini beserta kode
                  verifikasi dan QR-nya.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {verifiedLetters.map((letter) => (
                  <li
                    key={letter.id}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <a
                      href={letter.qrPngUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0"
                      title="Lihat QR"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={letter.qrPngUrl}
                        alt={`QR ${letter.registrationNumber}`}
                        className="size-10 rounded border object-contain"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {letter.subject}
                        </p>
                        <Badge className="h-5 shrink-0 gap-1 bg-emerald-600 px-2 text-[11px] text-white">
                          <BadgeCheck className="size-3" />
                          Surat Sah
                        </Badge>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                        {letter.registrationNumber} · {getLetterTypeLabel(letter.letterType)} ·{" "}
                        {formatDate(letter.date)}
                      </p>
                    </div>
                    <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Kode: {letter.verificationCode}
                      </span>
                      <a
                        href={`/verifikasi/surat/${letter.verificationCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        Lihat hasil
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => deleteVerifiedLetter(letter.id)}
                      title="Hapus surat"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Surat Keluar */}
      <SectionHeading
        id="keluar"
        index="02"
        title="Surat Keluar"
        count={outgoingTotal}
      >
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/secretariat/outgoing-mail/new">
            <FileText className="size-3.5" />
            Buat di alur lama
          </Link>
        </Button>
      </SectionHeading>

      <div className="mt-4 overflow-hidden rounded-xl border shadow-sm">
        {outgoingItems.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum ada surat keluar.
          </p>
        ) : (
          <ul className="divide-y">
            {outgoingItems.map((item) => {
              const s = statusLabels[item.status] ?? {
                label: item.status,
                variant: "outline",
              };
              return (
                <li key={item.id}>
                  <Row
                    left={{
                      line1: item.subject,
                      line2: `${item.registrationNumber} · ${item.recipient} · ${formatDate(item.mailDate)}`,
                      mono: true,
                    }}
                    right={
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                          {s.label}
                        </Badge>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Surat Masuk */}
      <SectionHeading
        id="masuk"
        index="03"
        title="Surat Masuk"
        count={incomingTotal}
      >
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/secretariat/incoming-mail/new">
            <FileText className="size-3.5" />
            Agenda surat masuk
          </Link>
        </Button>
      </SectionHeading>

      <div className="mt-4 overflow-hidden rounded-xl border shadow-sm">
        {incomingItems.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum ada surat masuk.
          </p>
        ) : (
          <ul className="divide-y">
            {incomingItems.map((item) => {
              const s = statusLabels[item.status] ?? {
                label: item.status,
                variant: "outline",
              };
              return (
                <li key={item.id}>
                  <Row
                    left={{
                      line1: item.subject,
                      line2: `${item.registrationNumber} · ${item.sender} · ${formatDate(item.receivedDate)}`,
                      mono: true,
                    }}
                    right={
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                          {s.label}
                        </Badge>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/secretariat/incoming-mail/${item.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Arsip */}
      <SectionHeading
        id="arsip"
        index="04"
        title="Arsip"
        count={archivesTotal}
      >
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/secretariat/archive">
            <Archive className="size-3.5" />
            Kelola arsip
          </Link>
        </Button>
      </SectionHeading>

      <div className="mt-4 overflow-hidden rounded-xl border shadow-sm">
        {archives.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            Belum ada arsip.
          </p>
        ) : (
          <ul className="divide-y">
            {archives.map((item) => (
              <li key={item.id}>
                <Row
                  left={{
                    line1: item.title,
                    line2: `${item.archiveNumber} · ${item.documentType} · ${formatDate(item.archivedAt)}`,
                    mono: true,
                  }}
                  right={
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {item.category ?? "—"}
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
