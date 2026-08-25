import Link from "next/link";
import { AlertTriangle, ArrowRight, Cloud, CloudOff } from "lucide-react";

import { SectionCard } from "@/components/admin/shared/section-card";
import { cn } from "@/lib/utils";

interface MissingAttachments {
  outgoing: number;
  incoming: number;
  documents: number;
}

interface SystemHealthProps {
  driveEmail: string | null;
  missingAttachments: MissingAttachments;
}

export function SystemHealth({
  driveEmail,
  missingAttachments,
}: SystemHealthProps) {
  const totalMissing =
    missingAttachments.outgoing +
    missingAttachments.incoming +
    missingAttachments.documents;

  return (
    <SectionCard variant="glass">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Kesehatan Sistem</h2>
          <p className="text-xs text-muted-foreground">
            Status koneksi Drive dan kelengkapan lampiran.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            {driveEmail ? (
              <>
                <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Cloud className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Google Drive terhubung</p>
                  <p className="text-[11px] text-muted-foreground">
                    {driveEmail}
                  </p>
                </div>
              </>
            ) : (
              <>
                <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <CloudOff className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    Google Drive belum terhubung
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Arsip masih disimpan di Vercel Blob.
                  </p>
                </div>
              </>
            )}
          </div>
          <Link
            href="/admin/secretariat/surat-menyurat"
            className="flex items-center gap-1 text-[11px] font-medium text-primary transition-opacity hover:opacity-80"
          >
            Kelola
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div
          className={cn(
            "flex items-center justify-between rounded-md border bg-background px-3 py-2.5",
            totalMissing > 0 && "border-destructive/40 bg-destructive/5",
          )}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-md",
                totalMissing > 0
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {totalMissing > 0 ? (
                <AlertTriangle className="size-4" />
              ) : (
                <Cloud className="size-4" />
              )}
            </span>
            <div>
              <p className="text-sm font-medium">
                {totalMissing > 0
                  ? `${totalMissing} lampiran belum diunggah`
                  : "Semua lampiran sudah lengkap"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Keluar {missingAttachments.outgoing} · Masuk{" "}
                {missingAttachments.incoming} · Dokumen{" "}
                {missingAttachments.documents}
              </p>
            </div>
          </div>
          {totalMissing > 0 && (
            <Link
              href="/admin/secretariat/surat-menyurat"
              className="flex items-center gap-1 text-[11px] font-medium text-destructive transition-opacity hover:opacity-80"
            >
              Periksa
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
