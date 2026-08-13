"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImagePathField({
  defaultValue,
  inputId = "image",
}: {
  defaultValue: string;
  inputId?: string;
}) {
  const [path, setPath] = useState(defaultValue);
  const [failed, setFailed] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs">
        Path gambar
      </Label>
      <Input
        id={inputId}
        name="image"
        defaultValue={defaultValue}
        onChange={(e) => {
          setPath(e.target.value);
          setFailed(false);
        }}
        placeholder="/images/nama-file.jpg"
        className="rounded-md text-xs"
      />

      {path.trim() && !failed ? (
        <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border bg-muted/40">
          <Image
            src={path}
            alt="Pratinjau gambar hero"
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          {path.trim()
            ? "Gambar tidak ditemukan pada path tersebut."
            : "Kosong — hero hanya akan menampilkan teks."}
        </p>
      )}
    </div>
  );
}