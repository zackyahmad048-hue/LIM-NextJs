"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Power, PowerOff } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { Button } from "@/components/ui/button";

import {
  WAJIB_KHIDMAH_STATUS_LABELS,
  type WajibKhidmahStatus,
} from "@/modules/twk/domain/entities";

import {
  DeactivateMemberDialog,
  ReactivateMemberDialog,
} from "./deactivate.dialog";
import { MemberDialog } from "./member.dialog";
import { StatusBadge } from "./columns";
import type { MemberRow } from "./types";

interface Props {
  member: MemberRow;
}

interface FieldProps {
  label: string;
  value: string | null;
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm">
        {value && value.trim() ? (
          value
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </p>
    </div>
  );
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const STATUS_TONE_DESCRIPTION: Record<WajibKhidmahStatus, string> = {
  AKTIF: "Sedang menjalankan Wajib Khidmah.",
  GUGUR: "Tidak melanjutkan Wajib Khidmah (Gugur).",
  BEBAS_TUGAS: "Dibebaskan dari tugas Wajib Khidmah.",
  QODLO: "Status Qodlo (gugur sebelum masa tugas).",
};

export function TwkDetailView({ member }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const isActive = member.status === "AKTIF";

  return (
    <PageContainer>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/twk">
            <ArrowLeft className="size-4" />
            Kembali ke daftar
          </Link>
        </Button>
      </div>

      <PageHeader
        title={member.nama}
        description={WAJIB_KHIDMAH_STATUS_LABELS[member.status]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            {isActive ? (
              <DeactivateMemberDialog
                id={member.id}
                nama={member.nama}
                trigger={
                  <Button variant="outline" size="sm">
                    <PowerOff className="size-4" />
                    Nonaktifkan
                  </Button>
                }
              />
            ) : (
              <ReactivateMemberDialog
                id={member.id}
                nama={member.nama}
                trigger={
                  <Button variant="outline" size="sm">
                    <Power className="size-4" />
                    Aktifkan
                  </Button>
                }
              />
            )}
          </>
        }
      />

      <div className="mt-6 space-y-4">
        <SectionCard className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={member.status} />
            <p className="text-sm text-muted-foreground">
              {STATUS_TONE_DESCRIPTION[member.status]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              {isActive ? (
                <Power className="size-3.5" />
              ) : (
                <PowerOff className="size-3.5" />
              )}
              Status terakhir diubah: {formatDate(member.updatedAt)}
            </span>
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Data Utama</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field label="Nama" value={member.nama} />
            <Field label="Asal Daerah" value={member.asalDaerah} />
            <Field label="Pos Wajib Khidmah" value={member.posWajibKhidmah} />
            <Field label="Tempat Khidmah" value={member.tempatWajibKhidmah} />
            <Field label="Alamat Lembaga" value={member.alamatLembaga} />
            <Field label="Tugas Khidmah" value={member.tugasKhidmah} />
            <Field label="Absensi" value={member.absensi} />
          </div>
        </SectionCard>

        <SectionCard className="space-y-6">
          <h2 className="text-base font-semibold">Status & Catatan</h2>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Field
              label="Status"
              value={WAJIB_KHIDMAH_STATUS_LABELS[member.status]}
            />
            <Field label="Keterangan" value={member.keterangan} />
            <div className="sm:col-span-2">
              <Field label="Catatan" value={member.catatan} />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="space-y-2 text-xs text-muted-foreground">
          <p>Dibuat: {formatDate(member.createdAt)}</p>
          <p>Diperbarui: {formatDate(member.updatedAt)}</p>
        </SectionCard>
      </div>

      <MemberDialog
        open={editOpen}
        member={member}
        onOpenChange={setEditOpen}
      />
    </PageContainer>
  );
}
