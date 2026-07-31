"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { importImsakiyah } from "@/modules/falak/presentation/falak.action";

export function ImsakiyahImportButton() {
  const [pending, startTransition] = useTransition();

  function handleImport() {
    startTransition(async () => {
      try {
        const result = await importImsakiyah();
        if (result.warnings.length > 0) {
          toast.warning(`Import selesai: ${result.imported} baris. ${result.warnings.length} nilai perlu dicek.`);
        } else {
          toast.success(`Import selesai: ${result.imported} baris diimpor.`);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal mengimpor data imsakiyah.");
      }
    });
  }

  return (
    <Button size="sm" onClick={handleImport} disabled={pending}>
      <RefreshCw className={pending ? "size-4 animate-spin" : "size-4"} />
      {pending ? "Mengimpor..." : "Import dari Google Sheets"}
    </Button>
  );
}
