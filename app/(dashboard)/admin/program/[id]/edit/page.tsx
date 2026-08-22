import { formatDateInput } from "@/lib/format";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Archive,
  Calendar,
  CheckCircle,
  Eye,
  List,
  Pencil,
  RotateCcw,
  Send,
  UserCheck,
  UserPlus,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionForm } from "@/components/admin/shared/action-form";

import {
  getProgramById,
  getUsers,
} from "@/modules/program/queries/program.query";
import {
  updateProgram,
  transitionProgramStatus,
} from "@/modules/program/presentation/program.action";

const programTypes = [
  "Safari Dakwah",
  "Pelatihan",
  "Seminar",
  "Kajian",
  "Musyawarah",
  "Sosial",
  "Lainnya",
];

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  REGISTRATION_OPEN: "Registrasi Dibuka",
  REGISTRATION_CLOSED: "Registrasi Ditutup",
  ON_GOING: "Berlangsung",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
  ARCHIVED: "Diarsipkan",
};

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, users] = await Promise.all([getProgramById(id), getUsers()]);

  if (!program) notFound();

  const subPages = [
    { href: `/admin/program/${id}/schedules`, icon: Calendar, label: "Jadwal" },
    {
      href: `/admin/program/${id}/committees`,
      icon: UserCheck,
      label: "Panitia",
    },
    {
      href: `/admin/program/${id}/participants`,
      icon: UserPlus,
      label: "Peserta",
    },
    { href: `/admin/program/${id}/attendance`, icon: List, label: "Absensi" },
    {
      href: `/admin/program/${id}/documentation`,
      icon: Eye,
      label: "Dokumentasi",
    },
  ];

  const statusActions: {
    label: string;
    status: string;
    icon: typeof Send;
    variant: "default" | "secondary" | "destructive" | "outline";
  }[] = [];
  if (program.status === "DRAFT")
    statusActions.push({
      label: "Publish",
      status: "PUBLISHED",
      icon: Send,
      variant: "default",
    });
  if (program.status === "PUBLISHED" || program.status === "DRAFT")
    statusActions.push({
      label: "Buka Registrasi",
      status: "REGISTRATION_OPEN",
      icon: RotateCcw,
      variant: "default",
    });
  if (program.status === "REGISTRATION_OPEN")
    statusActions.push({
      label: "Tutup Registrasi",
      status: "REGISTRATION_CLOSED",
      icon: XCircle,
      variant: "secondary",
    });
  if (
    ["PUBLISHED", "REGISTRATION_OPEN", "REGISTRATION_CLOSED"].includes(
      program.status,
    )
  )
    statusActions.push({
      label: "Mulai",
      status: "ON_GOING",
      icon: CheckCircle,
      variant: "default",
    });
  if (program.status === "ON_GOING")
    statusActions.push({
      label: "Selesaikan",
      status: "COMPLETED",
      icon: CheckCircle,
      variant: "default",
    });
  if (!["COMPLETED", "ARCHIVED", "CANCELLED"].includes(program.status))
    statusActions.push({
      label: "Batalkan",
      status: "CANCELLED",
      icon: XCircle,
      variant: "destructive",
    });
  if (["COMPLETED", "CANCELLED"].includes(program.status))
    statusActions.push({
      label: "Arsipkan",
      status: "ARCHIVED",
      icon: Archive,
      variant: "outline",
    });

  return (
    <PageContainer>
      <PageHeader
        title={program.name}
        description={`Kode: ${program.code} · Status: ${statusLabels[program.status] ?? program.status}`}
      />

      <div className="flex flex-wrap gap-2">
        {statusActions.map((action) => {
          const Icon = action.icon;
          return (
            <form
              key={action.status}
              action={transitionProgramStatus.bind(
                null,
                program.id,
                action.status,
              )}
            >
              <Button type="submit" variant={action.variant} size="sm">
                <Icon className="size-3.5" />
                {action.label}
              </Button>
            </form>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {subPages.map((page) => {
          const Icon = page.icon;
          return (
            <Button asChild key={page.href} variant="outline" size="sm">
              <Link href={page.href}>
                <Icon className="size-3.5" />
                {page.label}
              </Link>
            </Button>
          );
        })}
      </div>

      <ActionForm
        action={updateProgram.bind(null, program.id)}
        submitLabel="Simpan Perubahan"
        submitIcon={<Pencil className="size-4" />}
      >
        <input type="hidden" name="code" value={program.code} />

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Program</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-xs">
                Kode Program
              </Label>
              <Input
                id="code"
                name="code"
                required
                defaultValue={program.code}
                className="rounded-md text-xs"
                disabled
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs">
                Jenis Program
              </Label>
              <NativeSelect
                id="type"
                name="type"
                required
                defaultValue={program.type}
                className="h-9 w-full text-xs"
              >
                {programTypes.map((t) => (
                  <NativeSelectOption key={t} value={t}>
                    {t}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name" className="text-xs">
                Nama Program
              </Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="off"
                defaultValue={program.name}
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description" className="text-xs">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={program.description ?? ""}
                className="min-h-20 rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="personInChargeId" className="text-xs">
                Penanggung Jawab
              </Label>
              <NativeSelect
                id="personInChargeId"
                name="personInChargeId"
                required
                defaultValue={program.personInChargeId ?? ""}
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih PIC</NativeSelectOption>
                {users.map((u) => (
                  <NativeSelectOption key={u.id} value={u.id}>
                    {u.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Tanggal & Pendaftaran</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-xs">
                Tanggal Mulai
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={formatDateInput(program.startDate)}
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-xs">
                Tanggal Selesai
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={formatDateInput(program.endDate)}
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="registrationOpen" className="text-xs">
                Buka Pendaftaran
              </Label>
              <Input
                id="registrationOpen"
                name="registrationOpen"
                type="date"
                defaultValue={formatDateInput(program.registrationOpen)}
                className="rounded-md text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="registrationClose" className="text-xs">
                Tutup Pendaftaran
              </Label>
              <Input
                id="registrationClose"
                name="registrationClose"
                type="date"
                defaultValue={formatDateInput(program.registrationClose)}
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>

      </ActionForm>
    </PageContainer>
  );
}
