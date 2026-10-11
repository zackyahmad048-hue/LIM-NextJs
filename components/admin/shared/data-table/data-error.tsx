"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function DataError({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" role="alert">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive/40" />
      <h2 className="font-semibold text-admin-content-fg">Gagal memuat data</h2>
      <p className="mt-2 text-sm text-admin-content-fg/60">
        {message ?? "Terjadi kesalahan saat mengambil data. Silakan coba lagi."}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}
