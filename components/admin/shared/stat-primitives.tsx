import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StatItem {
  /** Opsional — identitas stabil untuk list dinamis; fallback ke urutan. */
  key?: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
}

interface StatPrimitivesProps {
  items: StatItem[];
  className?: string;
}

const statValueClass =
  "font-heading font-semibold tracking-[-0.01em] tabular-nums text-admin-content-fg";

/** Deret statistik ringkas (kap maks 3, S3) — tipis di atas/awal `band` sebagai
 * permukaan netral, bukan kartu. Statistik densitas di dalam `band` memakai `stat-row`. */
export function StatStrip({ items, className }: StatPrimitivesProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:items-start sm:gap-x-8",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={item.key ?? index}>
          <dt className="text-sm text-admin-content-fg/60">{item.label}</dt>
          <dd className={cn("mt-0.5 text-2xl", statValueClass)}>{item.value}</dd>
          {item.description != null && (
            <dd className="text-xs text-admin-content-fg/50">{item.description}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/** Daftar statistik densitas rapat (angka ke-5+ atau varian ringkas, S2) — baris
 * label:value di dalam `band`, dipisah `border-t`. */
export function StatRow({ items, className }: StatPrimitivesProps) {
  return (
    <dl className={cn("divide-y divide-admin-border/50", className)}>
      {items.map((item, index) => (
        <div
          key={item.key ?? index}
          className="flex items-baseline justify-between gap-4 py-2.5"
        >
          <dt className="text-sm text-admin-content-fg/70">{item.label}</dt>
          <dd className="text-right">
            <span className={cn("text-lg", statValueClass)}>{item.value}</span>
            {item.description != null && (
              <span className="ml-2 text-xs text-admin-content-fg/50">
                {item.description}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}