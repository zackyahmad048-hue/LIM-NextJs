"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Band } from "@/components/admin/shared/band";
import { FormGroup } from "@/components/admin/shared/form-group";
import { ActionResultMessage } from "@/components/admin/shared/action-result-message";
import {
  INITIAL_ACTION_RESULT,
} from "@/modules/shared/presentation/action-result";
import { SigningEditor } from "@/components/admin/secretariat/signing-editor";
import { SignerFields } from "@/components/admin/secretariat/signer-fields";

import { LETTER_TYPES } from "@/config/letter-types";
import { createOutgoingMail } from "@/modules/secretariat/presentation/secretariat.action";
import type { CentralBoardSigners } from "@/modules/cms/queries/structure.query";
import { NumberPreview } from "./number-preview";

export interface LetterLevelOption {
  code: string;
  label: string;
}

export function OutgoingMailForm({
  levels,
  pengurus,
}: {
  levels: LetterLevelOption[];
  pengurus: CentralBoardSigners;
}) {
  const router = useRouter();
  const [levelCode, setLevelCode] = useState("");
  const [categoryCode, setCategoryCode] = useState("");
  const [mailDate, setMailDate] = useState("");
  const [state, formAction, pending] = useActionState(
    createOutgoingMail,
    INITIAL_ACTION_RESULT,
  );
  const navigated = useRef(false);

  useEffect(() => {
    if (state.ok && !navigated.current) {
      navigated.current = true;
      router.push("/admin/secretariat/surat-menyurat");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-3">
      <Band variant="raised" title="Informasi Surat" description="Tingkat dan kategori menentukan nomor surat resmi. Nomor dan QR verifikasi diterbitkan otomatis saat surat ditandai terkirim.">
        <NumberPreview
          levelCode={levelCode}
          categoryCode={categoryCode}
          mailDate={mailDate}
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <FormGroup legend="Tingkat Kepengurusan">
            <NativeSelect
              id="levelCode"
              name="levelCode"
              required
              value={levelCode}
              onChange={(event) => setLevelCode(event.target.value)}
              className="w-full"
            >
              <NativeSelectOption value="">Pilih tingkat</NativeSelectOption>
              {levels.map((level) => (
                <NativeSelectOption key={level.code} value={level.code}>
                  {level.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormGroup>

          <FormGroup legend="Kategori Surat">
            <NativeSelect
              id="categoryCode"
              name="categoryCode"
              required
              value={categoryCode}
              onChange={(event) => setCategoryCode(event.target.value)}
              className="w-full"
            >
              <NativeSelectOption value="">Pilih kategori</NativeSelectOption>
              {LETTER_TYPES.map((type) => (
                <NativeSelectOption key={type.key} value={type.key}>
                  {type.key} — {type.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FormGroup>

          <FormGroup legend="Tanggal Surat">
            <Input
              id="mailDate"
              name="mailDate"
              type="date"
              required
              value={mailDate}
              onChange={(event) => setMailDate(event.target.value)}
              className="rounded-md text-xs"
            />
          </FormGroup>

          <FormGroup legend="Penerima">
            <Input
              id="recipient"
              name="recipient"
              placeholder="Nama penerima surat"
              className="rounded-md text-xs"
            />
          </FormGroup>

          <FormGroup legend="Perihal Surat" className="md:col-span-2">
            <Input
              id="subject"
              name="subject"
              required
              placeholder="Perihal surat"
              className="rounded-md text-xs"
            />
          </FormGroup>
        </div>
      </Band>

      <Band variant="raised" title="QR Penanda Tangan" description="Nama & jabatan Ketua dan Sekretaris diambil dari struktur Pengurus Pusat dan dijadikan konten QR yang ditempel pada dokumen saat surat ditandai terkirim.">
        <SignerFields pengurus={pengurus} />
      </Band>

      <Band variant="raised" title="Dokumen Surat" description="Unggah dokumen surat, lalu atur posisi QR Ketua, Sekretaris, dan Verifikasi pada halaman dokumen.">
        <SigningEditor />
      </Band>

      <ActionResultMessage state={state} />

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          <Save className="size-4" />
          Simpan Surat
        </Button>
      </div>
    </form>
  );
}