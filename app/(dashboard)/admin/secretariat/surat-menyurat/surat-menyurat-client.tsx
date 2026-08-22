"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDateId } from "@/lib/format";
import {
  ArrowRight,
  Archive,
  Inbox,
  PenLine,
  QrCode,
  Send,
  RotateCcw,
  Cloud,
  CloudOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { LetterPlate } from "@/components/admin/shared/letter-plate";
import { cn } from "@/lib/utils";

import { transitionOutgoingMailStatus } from "@/modules/secretariat/presentation/secretariat.action";

type OutgoingStatus = "DRAFT" | "SENT" | "ARCHIVED";

interface OutgoingItem {
  id: string;
  subject: string;
  recipient: string | null;
  mailDate: Date | string;
  status: OutgoingStatus;
  fullNumber: string | null;
  levelCode: string | null;
  categoryCode: string | null;
  verificationCode: string | null;
  qrFileId: string | null;
}

interface IncomingItem {
  id: string;
  registrationNumber: string;
  sender: string;
  subject: string;
  receivedDate: Date | string;
  status: string;
}

interface LatestIssued {
  id: string;
  fullNumber: string | null;
  subject: string;
  mailDate: Date | string;
  levelCode: string | null;
  categoryCode: string | null;
}

interface Stats {
  outgoingTotal: number;
  incomingTotal: number;
  archivedTotal: number;
  pendingCount: number;
}

interface SuratMenyuratClientProps {
  stats: Stats;
  latestIssued: LatestIssued | null;
  outgoingItems: OutgoingItem[];
  outgoingTotal: number;
  incomingItems: IncomingItem[];
  incomingTotal: number;
  driveEmail: string | null;
}

function formatDateLong(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const statusConfig: Record<
  OutgoingStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Terkirim", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const incomingStatusConfig: Record<string, { label: string; variant: any }> = {
  RECEIVED: { label: "Diterima", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

interface ConfirmState {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

export function SuratMenyuratClient({
  stats,
  latestIssued,
  outgoingItems,
  outgoingTotal,
  incomingItems,
  incomingTotal,
  driveEmail,
}: SuratMenyuratClientProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("drive") === "connected") {
      toast.success("Google Drive berhasil dihubungkan.");
      window.history.replaceState({}, "", "/admin/secretariat/surat-menyurat");
    } else if (params.get("drive") === "error") {
      toast.error("Gagal menghubungkan Google Drive. Coba lagi.");
      window.history.replaceState({}, "", "/admin/secretariat/surat-menyurat");
    }
  }, []);

  async function runTransition(
    id: string,
    status: OutgoingStatus,
    confirmMessage?: { title: string; description: string },
  ) {
    const execute = async () => {
      setPendingAction(`${id}:${status}`);
      try {
        const result = await transitionOutgoingMailStatus(id, status);
        if (result?.success) {
          toast.success(
            statusConfig[status]?.label
              ? `Surat ditandai ${statusConfig[status].label.toLowerCase()}.`
              : "Status diperbarui.",
          );
          router.refresh();
        } else {
          toast.error(result?.message ?? "Gagal memperbarui status.");
        }
      } finally {
        setPendingAction(null);
        setConfirm(null);
      }
    };

    if (confirmMessage) {
      setConfirm({
        title: confirmMessage.title,
        description: confirmMessage.description,
        onConfirm: execute,
      });
      return;
    }
    await execute();
  }

  const isPending = (id: string, status: OutgoingStatus) =>
    pendingAction === `${id}:${status}`;

  const nextActions = (item: OutgoingItem) => {
    const actions: { status: OutgoingStatus; label: string; icon: any }[] = [];
    switch (item.status) {
      case "DRAFT":
        actions.push({ status: "SENT", label: "Tandai Terkirim", icon: Send });
        break;
      case "SENT":
        actions.push({ status: "ARCHIVED", label: "Arsipkan", icon: Archive });
        actions.push({
          status: "DRAFT",
          label: "Kembalikan ke Draft",
          icon: RotateCcw,
        });
        break;
      case "ARCHIVED":
        break;
    }
    return actions;
  };

  const confirmFor = (status: OutgoingStatus) => {
    switch (status) {
      case "ARCHIVED":
        return {
          title: "Arsipkan surat?",
          description:
            "Surat masuk arsip dan tidak dapat diubah lagi. Lampiran dipindah ke penyimpanan arsip.",
        };
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Surat Menyurat"
        description="Terbitkan nomor & QR verifikasi, pantau status surat keluar, dan catat surat masuk."
      />

      {/* Plat nomor terakhir + statistik */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <SectionCard className="lg:col-span-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Nomor Terbit Terakhir
          </p>
          {latestIssued?.fullNumber ? (
            <div className="mt-3 space-y-3">
              <LetterPlate fullNumber={latestIssued.fullNumber} size="md" />
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {latestIssued.subject}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateLong(latestIssued.mailDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2 py-1">
                  <QrCode className="size-3.5 text-primary" />
                  <span className="text-[11px] font-medium text-primary">
                    QR verifikasi otomatis
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed px-4 py-6 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Belum ada nomor terbit
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Nomor diterbitkan otomatis saat surat keluar ditandai terkirim.
              </p>
            </div>
          )}
        </SectionCard>

        <SectionCard className="lg:col-span-2">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Sekilas
          </p>
          <dl className="mt-3 divide-y">
            {[
              { label: "Surat keluar", value: stats.outgoingTotal },
              { label: "Surat masuk", value: stats.incomingTotal },
              { label: "Diarsipkan", value: stats.archivedTotal },
              {
                label: "Perlu tindakan",
                value: stats.pendingCount,
                highlight: stats.pendingCount > 0,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2"
              >
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    row.highlight ? "text-primary" : "text-foreground",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </SectionCard>
      </div>

      {/* Pita kerja: Tulis & Terima */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/secretariat/outgoing-mail/new"
          className="group flex items-start justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <PenLine className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold">Tulis surat keluar</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Simpan surat, lalu tandai terkirim untuk menerbitkan nomor dan
                QR verifikasi.
              </p>
            </div>
          </div>
          <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/admin/secretariat/incoming-mail/new"
          className="group flex items-start justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Inbox className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold">Catat surat masuk</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Dicatat lalu langsung diarsipkan.
              </p>
            </div>
          </div>
          <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Status penyimpanan */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          {driveEmail ? (
            <>
              <Cloud className="size-4 text-primary" />
              <p className="text-sm">
                Google Drive terhubung —{" "}
                <span className="font-medium">{driveEmail}</span>
              </p>
            </>
          ) : (
            <>
              <CloudOff className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Penyimpanan aktif di Vercel Blob. Hubungkan Google Drive agar
                arsip otomatis dipindah saat kuota penuh.
              </p>
            </>
          )}
        </div>
        {driveEmail ? (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await fetch("/api/admin/google-drive/disconnect", {
                method: "POST",
              });
              toast.success("Google Drive diputuskan.");
              router.refresh();
            }}
          >
            Putuskan koneksi
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href="/api/admin/google-drive/connect">
              <Cloud className="size-4" />
              Hubungkan Google Drive
            </Link>
          </Button>
        )}
      </div>

      {/* Surat keluar terbaru */}
      <div className="mt-6 overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b bg-card px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold">Surat keluar terbaru</h2>
            <span className="text-sm tabular-nums text-muted-foreground">
              {outgoingTotal}
            </span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/secretariat/outgoing-mail/list">
              Kelola semua
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {outgoingItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <PenLine className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">Belum ada surat keluar</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Mulai dari Tulis surat keluar di atas — draft dan pengajuan akan
              muncul di sini.
            </p>
          </div>
        ) : (
          <ul className="divide-y bg-card">
            {outgoingItems.map((item) => {
              const status = statusConfig[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              const actions = nextActions(item);
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.fullNumber ? (
                      <LetterPlate fullNumber={item.fullNumber} size="sm" />
                    ) : (
                      <span className="rounded-lg border border-dashed px-2.5 py-1 text-sm font-medium tabular-nums text-muted-foreground">
                        — / — / — / — / —
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.subject}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.recipient ?? "Tanpa penerima"} ·{" "}
                        {formatDateId(item.mailDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge
                      variant={status.variant}
                      className="h-5 px-2 text-[11px]"
                    >
                      {status.label}
                    </Badge>

                    {item.status !== "DRAFT" &&
                      item.verificationCode &&
                      item.qrFileId && (
                        <Button asChild variant="ghost" size="icon-sm" aria-label="Lihat QR" title="Lihat QR">
                          <Link
                            href={`/api/media/${item.qrFileId}?mime=image/png`}
                            target="_blank"
                          >
                            <QrCode className="size-3.5" />
                          </Link>
                        </Button>
                      )}

                    {actions.map((action) => {
                      const needsConfirm = confirmFor(action.status) !== null;
                      return (
                        <Button
                          key={action.status}
                          variant={
                            action.status === "SENT"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          disabled={isPending(item.id, action.status)}
                          onClick={() =>
                            runTransition(
                              item.id,
                              action.status,
                              needsConfirm
                                ? (confirmFor(action.status) as {
                                    title: string;
                                    description: string;
                                  })
                                : undefined,
                            )
                          }
                        >
                          {isPending(item.id, action.status) ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <action.icon className="size-3.5" />
                          )}
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Surat masuk terbaru */}
      <div className="mt-6 overflow-hidden rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b bg-card px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-semibold">Surat masuk terbaru</h2>
            <span className="text-sm tabular-nums text-muted-foreground">
              {incomingTotal}
            </span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/secretariat/incoming-mail/list">
              Kelola semua
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {incomingItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">Belum ada surat masuk</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Surat masuk dicatat dengan nomor asli pengirim lalu langsung
              diarsipkan.
            </p>
          </div>
        ) : (
          <ul className="divide-y bg-card">
            {incomingItems.map((item) => {
              const status = incomingStatusConfig[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-md bg-muted px-2 py-1">
                      <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                        {item.registrationNumber}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.subject}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.sender} · {formatDateId(item.receivedDate)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={status.variant}
                    className="h-5 shrink-0 px-2 text-[11px]"
                  >
                    {status.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        onConfirm={() => confirm?.onConfirm()}
        title={confirm?.title ?? ""}
        description={confirm?.description ?? ""}
      />
    </PageContainer>
  );
}
