"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-12">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {error.message || "Terjadi kesalahan yang tidak terduga."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Coba lagi
      </Button>
    </div>
  );
}
