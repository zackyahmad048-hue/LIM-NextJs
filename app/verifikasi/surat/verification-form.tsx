"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerificationForm() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const code = value.trim();
    if (!code) return;
    router.push(`/verifikasi/surat/${encodeURIComponent(code)}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2" role="search">
      <label htmlFor="kode-verifikasi" className="text-xs font-medium">
        Periksa nomor surat lain
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="kode-verifikasi"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="001/PP/A/VIII/2026"
          aria-describedby="kode-verifikasi-hint"
          className="rounded-lg font-data"
        />
        <Button type="submit" size="sm" className="shrink-0 gap-1.5">
          <Search className="size-3.5" />
          Periksa
        </Button>
      </div>
      <p id="kode-verifikasi-hint" className="text-[11px] text-muted-foreground">
        Ketik lengkap sesuai lembar surat, termasuk bulan angka Romawi.
      </p>
    </form>
  );
}
