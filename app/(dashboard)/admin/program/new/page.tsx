import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { SectionCard } from "@/components/admin/shared/section-card";
import { ActionForm } from "@/components/admin/shared/action-form";

import { getUsers } from "@/modules/program/queries/program.query";
import { createProgram } from "@/modules/program/presentation/program.action";

const programTypes = [
  "Safari Dakwah",
  "Pelatihan",
  "Seminar",
  "Kajian",
  "Musyawarah",
  "Sosial",
  "Lainnya",
];

export default async function NewProgramPage() {
  const users = await getUsers();

  return (
    <PageContainer>
      <PageHeader
        title="Buat Program Baru"
        description="Lengkapi informasi program untuk memulai."
      />

      <ActionForm action={createProgram} submitLabel="Simpan Program" submitIcon={<Plus className="size-4" />}>
        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Informasi Program</h2>
            <p className="text-xs text-muted-foreground">Data utama program.</p>
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
                placeholder="SD-2027-001"
                className="rounded-md text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs">
                Jenis Program
              </Label>
              <select
                id="type"
                name="type"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih jenis</option>
                {programTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
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
                placeholder="Nama lengkap program"
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
                className="min-h-20 rounded-md text-xs"
                placeholder="Deskripsi program (opsional)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="personInChargeId" className="text-xs">
                Penanggung Jawab
              </Label>
              <select
                id="personInChargeId"
                name="personInChargeId"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="">Pilih PIC</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="rounded-lg p-4">
          <div className="mb-4 border-b pb-3">
            <h2 className="text-base font-semibold">Tanggal & Pendaftaran</h2>
            <p className="text-xs text-muted-foreground">
              Atur jadwal dan pendaftaran program.
            </p>
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
                className="rounded-md text-xs"
              />
            </div>
          </div>
        </SectionCard>
      </ActionForm>
    </PageContainer>
  );
}
