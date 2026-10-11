import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
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
        <Band variant="raised" title="Informasi Program" description="Data utama program.">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Kode Program" >
              <Input
                id="code"
                name="code"
                
                placeholder="SD-2027-001"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Jenis Program" >
              <NativeSelect
                id="type"
                name="type"
                
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih jenis</NativeSelectOption>
                {programTypes.map((t) => (
                  <NativeSelectOption key={t} value={t}>
                    {t}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>

            <FormGroup legend="Nama Program" className="md:col-span-2" >
              <Input
                id="name"
                name="name"
                
                autoComplete="off"
                placeholder="Nama lengkap program"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Deskripsi" className="md:col-span-2">
              <Textarea
                id="description"
                name="description"
                className="min-h-20 rounded-md text-xs"
                placeholder="Deskripsi program (opsional)"
              />
            </FormGroup>

            <FormGroup legend="Penanggung Jawab" >
              <NativeSelect
                id="personInChargeId"
                name="personInChargeId"
                
                className="h-9 w-full text-xs"
              >
                <NativeSelectOption value="">Pilih PIC</NativeSelectOption>
                {users.map((u) => (
                  <NativeSelectOption key={u.id} value={u.id}>
                    {u.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FormGroup>
          </div>
        </Band>

        <Band variant="raised" title="Tanggal & Pendaftaran" description="Atur jadwal dan pendaftaran program.">
          <div className="grid gap-3 md:grid-cols-2">
            <FormGroup legend="Tanggal Mulai" >
              <Input
                id="startDate"
                name="startDate"
                type="date"
                
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Tanggal Selesai" >
              <Input
                id="endDate"
                name="endDate"
                type="date"
                
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Buka Pendaftaran">
              <Input
                id="registrationOpen"
                name="registrationOpen"
                type="date"
                className="rounded-md text-xs"
              />
            </FormGroup>

            <FormGroup legend="Tutup Pendaftaran">
              <Input
                id="registrationClose"
                name="registrationClose"
                type="date"
                className="rounded-md text-xs"
              />
            </FormGroup>
          </div>
        </Band>
      </ActionForm>
    </PageContainer>
  );
}