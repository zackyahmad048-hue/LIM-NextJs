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
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 sm:flex-row"
      role="search"
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ketik nomor surat, mis. 001/PP/A/VIII/2026"
        className="rounded-lg"
        aria-label="Nomor surat"
      />
      <Button type="submit" size="sm" className="shrink-0 gap-1.5">
        <Search className="size-3.5" />
        Periksa Surat
      </Button>
    </form>
  );
}
