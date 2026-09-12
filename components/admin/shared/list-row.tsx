import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ListRowProps {
  title: ReactNode;
  description?: ReactNode;
  /** Konten kecil di kanan (mis. pill status, tanggal). */
  meta?: ReactNode;
  /** Aksi kompak di paling kanan (mis. tombol edit). */
  action?: ReactNode;
  className?: string;
}

/** Baris daftar tanpa kotak — dipakai langsung di dalam `band` memakai
 * `divide-y divide-admin-border/50` pada pembungkusnya (L1/L2). */
export function ListRow({
  title,
  description,
  meta,
  action,
  className,
}: ListRowProps) {
  return (
    <li
      className={cn(
        "flex items-center justify-between gap-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-admin-content-fg">{title}</h3>
        {description != null && (
          <p className="mt-0.5 text-xs text-admin-content-fg/80">{description}</p>
        )}
      </div>
      {(meta != null || action != null) && (
        <div className="flex shrink-0 items-center gap-3">
          {meta}
          {action}
        </div>
      )}
    </li>
  );
}