"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { CentralBoardSigners } from "@/modules/cms/queries/structure.query";

interface SignerFieldsProps {
  pengurus: CentralBoardSigners;
  initialKetuaName?: string | null;
  initialKetuaPosition?: string | null;
  initialSekretarisName?: string | null;
  initialSekretarisPosition?: string | null;
}

function initialMember(
  list: CentralBoardSigners["ketua"],
  name: string | null | undefined,
) {
  return list.find((member) => member.name === name) ?? null;
}

/**
 * Field Nama/Jabatan Ketua & Sekretaris untuk surat keluar, diambil dari
 * struktur Pengurus Pusat (centralBoard). Jabatan terisi otomatis dari
 * pilihan nama.
 */
export function SignerFields({
  pengurus,
  initialKetuaName,
  initialKetuaPosition,
  initialSekretarisName,
  initialSekretarisPosition,
}: SignerFieldsProps) {
  const [ketuaName, setKetuaName] = useState(
    initialKetuaName ?? "",
  );
  const [ketuaPosition, setKetuaPosition] = useState(
    initialMember(pengurus.ketua, initialKetuaName)?.position ??
      initialKetuaPosition ??
      "",
  );
  const [sekretarisName, setSekretarisName] = useState(
    initialSekretarisName ?? "",
  );
  const [sekretarisPosition, setSekretarisPosition] = useState(
    initialMember(pengurus.sekretaris, initialSekretarisName)?.position ??
      initialSekretarisPosition ??
      "",
  );

  function handleKetuaChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const name = event.target.value;
    setKetuaName(name);
    const member = pengurus.ketua.find((item) => item.name === name);
    setKetuaPosition(member?.position ?? "");
  }

  function handleSekretarisChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const name = event.target.value;
    setSekretarisName(name);
    const member = pengurus.sekretaris.find((item) => item.name === name);
    setSekretarisPosition(member?.position ?? "");
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="ketuaName" className="text-xs">
          Nama Ketua
        </Label>
        <NativeSelect
          id="ketuaName"
          name="ketuaName"
          value={ketuaName}
          onChange={handleKetuaChange}
          className="w-full"
        >
          <NativeSelectOption value="">
            {pengurus.ketua.length === 0
              ? "Belum ada data pengurus pusat"
              : "Pilih Ketua"}
          </NativeSelectOption>
          {pengurus.ketua.map((member) => (
            <NativeSelectOption key={member.id} value={member.name}>
              {member.name} — {member.position}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <input
          type="hidden"
          name="ketuaPosition"
          value={ketuaPosition}
          readOnly
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ketuaPosition" className="text-xs">
          Jabatan Ketua
        </Label>
        <Input
          id="ketuaPosition"
          value={ketuaPosition}
          readOnly
          placeholder="Terisi otomatis"
          className="rounded-md bg-muted/40 text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sekretarisName" className="text-xs">
          Nama Sekretaris
        </Label>
        <NativeSelect
          id="sekretarisName"
          name="sekretarisName"
          value={sekretarisName}
          onChange={handleSekretarisChange}
          className="w-full"
        >
          <NativeSelectOption value="">
            {pengurus.sekretaris.length === 0
              ? "Belum ada data pengurus pusat"
              : "Pilih Sekretaris"}
          </NativeSelectOption>
          {pengurus.sekretaris.map((member) => (
            <NativeSelectOption key={member.id} value={member.name}>
              {member.name} — {member.position}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <input
          type="hidden"
          name="sekretarisPosition"
          value={sekretarisPosition}
          readOnly
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sekretarisPosition" className="text-xs">
          Jabatan Sekretaris
        </Label>
        <Input
          id="sekretarisPosition"
          value={sekretarisPosition}
          readOnly
          placeholder="Terisi otomatis"
          className="rounded-md bg-muted/40 text-xs"
        />
      </div>
    </div>
  );
}
