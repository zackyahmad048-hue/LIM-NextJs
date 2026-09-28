import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BandHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Header band (judul + deskripsi + slot aksi). Dipakai sendiri atau oleh `Band`. */
export function BandHeader({
  title,
  description,
  actions,
  className,
}: BandHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      {title != null && (
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-admin-content-fg">{title}</h2>
          {description != null && (
            <p className="mt-1 text-sm text-admin-content-fg/80">{description}</p>
          )}
        </div>
      )}
      {actions != null && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

interface BandProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Permukaan "band" — kartu solid admin (rounded-xl p-5) dengan header opsional.
 *  Khusyu Minimalis: no glass, no tint backgrounds. Solid card with hairline border.
 *  Tabel/form di dalamnya tetap solid. Satu standar radius/padding (spec). */
export function Band({
  children,
  title,
  description,
  actions,
  className,
}: BandProps) {
  const hasHeader = title != null || description != null || actions != null;

  return (
    <section
      className={cn(
        "bg-admin-card-bg border border-admin-card-border rounded-xl p-5 shadow-sm",
        "hover:shadow-md transition-shadow duration-200",
        className,
      )}
    >
      {hasHeader && (
        <BandHeader title={title} description={description} actions={actions} className="mb-5" />
      )}
      {children}
    </section>
  );
}