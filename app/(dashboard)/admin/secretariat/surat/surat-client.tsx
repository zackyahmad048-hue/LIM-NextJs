"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, Inbox, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminTable } from "@/components/admin/shared/admin-table";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const incomingStatusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  PROCESSED: { label: "Diproses", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const outgoingStatusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  APPROVED: { label: "Disetujui", variant: "default" },
  SENT: { label: "Terkirim", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

interface SuratMasuk {
  id: string;
  registrationNumber: string;
  sender: string;
  senderAddress: string | null;
  subject: string;
  receivedDate: Date | string;
  status: string;
}

interface SuratKeluar {
  id: string;
  registrationNumber: string;
  recipient: string;
  senderName: string | null;
  subject: string;
  mailDate: Date | string;
  status: string;
}

interface SuratPageClientProps {
  initialTab: "masuk" | "keluar";
  masukItems: SuratMasuk[];
  masukTotal: number;
  keluarItems: SuratKeluar[];
  keluarTotal: number;
  search: string;
}

export function SuratPageClient({
  initialTab,
  masukItems,
  masukTotal,
  keluarItems,
  keluarTotal,
}: SuratPageClientProps) {
  const [tab, setTab] = useState<"masuk" | "keluar">(initialTab);
  const router = useRouter();

  const items = tab === "masuk" ? masukItems : keluarItems;
  const total = tab === "masuk" ? masukTotal : keluarTotal;
  const statusLabels = tab === "masuk" ? incomingStatusLabels : outgoingStatusLabels;

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm("Hapus surat ini?");
    if (!confirmDelete) return;

    const { deleteIncomingMail, deleteOutgoingMail } = await import(
      "@/modules/secretariat/presentation/secretariat.action"
    );

    if (tab === "masuk") {
      await deleteIncomingMail(id);
    } else {
      await deleteOutgoingMail(id);
    }

    router.refresh();
  }

  const columns: { key: string; label: string; align?: "left" | "right"; render: (item: any) => ReactNode }[] = tab === "masuk"
    ? [
        {
          key: "registrationNumber",
          label: "No. Agenda",
          render: (item: SuratMasuk) => (
            <span className="text-xs font-mono text-muted-foreground">
              {item.registrationNumber}
            </span>
          ),
        },
        {
          key: "sender",
          label: "Pengirim",
          render: (item: SuratMasuk) => (
            <div className="max-w-[200px]">
              <p className="truncate text-sm font-medium">{item.sender}</p>
              {item.senderAddress && (
                <p className="truncate text-xs text-muted-foreground">
                  {item.senderAddress}
                </p>
              )}
            </div>
          ),
        },
        {
          key: "subject",
          label: "Perihal",
          render: (item: SuratMasuk) => (
            <span className="truncate text-xs">{item.subject}</span>
          ),
        },
        {
          key: "receivedDate",
          label: "Tanggal",
          render: (item: SuratMasuk) => (
            <span className="text-xs">{formatDate(item.receivedDate)}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (item: SuratMasuk) => {
            const s = statusLabels[item.status] ?? {
              label: item.status,
              variant: "outline" as const,
            };
            return (
              <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                {s.label}
              </Badge>
            );
          },
        },
        {
          key: "actions",
          label: "Aksi",
          align: "right" as const,
          render: (item: SuratMasuk) => (
            <div className="flex justify-end gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/secretariat/incoming-mail/${item.id}/edit`}>
                  <Pencil className="size-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ),
        },
      ]
    : [
        {
          key: "registrationNumber",
          label: "No. Registrasi",
          render: (item: SuratKeluar) => (
            <span className="text-xs font-mono text-muted-foreground">
              {item.registrationNumber}
            </span>
          ),
        },
        {
          key: "recipient",
          label: "Penerima",
          render: (item: SuratKeluar) => (
            <div className="max-w-[200px]">
              <p className="truncate text-sm font-medium">{item.recipient || "-"}</p>
              {item.senderName && (
                <p className="truncate text-xs text-muted-foreground">
                  {item.senderName}
                </p>
              )}
            </div>
          ),
        },
        {
          key: "subject",
          label: "Perihal",
          render: (item: SuratKeluar) => (
            <span className="truncate text-xs">{item.subject}</span>
          ),
        },
        {
          key: "mailDate",
          label: "Tanggal",
          render: (item: SuratKeluar) => (
            <span className="text-xs">{formatDate(item.mailDate)}</span>
          ),
        },
        {
          key: "status",
          label: "Status",
          render: (item: SuratKeluar) => {
            const s = statusLabels[item.status] ?? {
              label: item.status,
              variant: "outline" as const,
            };
            return (
              <Badge variant={s.variant} className="h-5 px-2 text-[11px]">
                {s.label}
              </Badge>
            );
          },
        },
        {
          key: "actions",
          label: "Aksi",
          align: "right" as const,
          render: (item: SuratKeluar) => (
            <div className="flex justify-end gap-1">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}>
                  <Pencil className="size-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ),
        },
      ];

  const newHref = tab === "masuk"
    ? "/admin/secretariat/incoming-mail/new"
    : "/admin/secretariat/outgoing-mail/new";

  return (
    <PageContainer>
      <PageHeader
        title="Pengelolaan Surat"
        description="Kelola surat masuk dan surat keluar organisasi."
      />

      <div className="flex gap-1 rounded-lg border bg-muted p-1">
        <button
          type="button"
          onClick={() => setTab("masuk")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "masuk"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Inbox className="size-4" />
          Surat Masuk
        </button>
        <button
          type="button"
          onClick={() => setTab("keluar")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            tab === "keluar"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Send className="size-4" />
          Surat Keluar
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} surat {tab === "masuk" ? "masuk" : "keluar"} ditemukan.
        </p>
        <Button asChild size="sm">
          <Link href={newHref}>
            <Plus className="size-4" />
            Surat {tab === "masuk" ? "Masuk" : "Keluar"} Baru
          </Link>
        </Button>
      </div>

      <AdminTable
        title={`Surat ${tab === "masuk" ? "Masuk" : "Keluar"}`}
        description={`${total} data`}
        columns={columns as any[]}
        data={items as any[]}
        emptyMessage={`Belum ada surat ${tab === "masuk" ? "masuk" : "keluar"}.`}
      />
    </PageContainer>
  );
}
