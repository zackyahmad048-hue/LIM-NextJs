"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { syncReportingAction } from "@/modules/reporting/presentation/reporting.action";

export function ReportingSyncButton() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSync() {
    setStatus("loading");
    setMessage("");
    try {
      const result = await syncReportingAction();
      setStatus("success");
      setMessage(
        `Berhasil sinkron: ${result.synced.map((r) => r).join(", ")}.`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sinkronisasi gagal.");
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">Sinkronisasi laporan ke Google Sheets</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Tulis ulang ringkasan statistik (sekretariat & falak) ke spreadsheet
          proyeksi. Proyeksi satu arah dari PostgreSQL.
        </p>
        {message ? (
          <p
            className={
              status === "error"
                ? "mt-2 text-xs text-destructive"
                : "mt-2 text-xs text-emerald-600"
            }
          >
            {message}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleSync}
        disabled={status === "loading"}
        className="shrink-0"
      >
        <RefreshCw
          className={`size-4 ${status === "loading" ? "animate-spin" : ""}`}
        />
        {status === "loading" ? "Menyinkronkan…" : "Sinkronkan sekarang"}
      </Button>
    </div>
  );
}
