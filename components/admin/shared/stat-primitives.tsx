import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StatItem {
  /** Opsional — identitas stabil untuk list dinamis; fallback ke urutan. */
  key?: string;
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  /** Highlight primary metric with accent dot */
  highlight?: boolean;
}

interface StatPrimitivesProps {
  items: StatItem[];
  className?: string;
}

/** Individual stat card for grid layout — glassmorphism content card.
 *  Wajib berada di dalam `<dl>` (lihat StatGrid): `dt`/`dd` hanya sah sebagai
 *  anak langsung `dl` atau `div` yang menjadi anak `dl`. Urutan DOM `dt` → `dd`
 *  mengikuti definisi (label → nilai) sedangkan `order-*` membalik tampilan
 *  agar nilai tetap di atas. */
export function StatCard({
  label,
  value,
  description,
  highlight,
  className,
}: StatItem & { className?: string }) {
  return (
    <div
      className={cn(
        "group glass flex flex-col p-5 transition-all hover:border-primary",
        className,
      )}
    >
      <dt className="order-2 mt-1.5 text-sm text-muted-foreground">{label}</dt>
      <dd className="order-1 flex items-baseline gap-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
        {highlight && (
          <span
            className="w-2 h-2 rounded-full bg-primary shrink-0"
            aria-hidden="true"
          />
        )}
        {value}
      </dd>
      {description != null && (
        <dd className="order-3 mt-2 text-xs text-muted-foreground/80">
          {description}
        </dd>
      )}
    </div>
  );
}

/** Grid of stat cards — replaces StatStrip for dashboard.
 *  Responsive: 1 col (<640) → 2 col (640-1023) → 4 col (≥1024) */
export function StatGrid({ items, className }: StatPrimitivesProps) {
  return (
    <dl
      className={cn(
        "grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => (
        <StatCard
          key={item.key ?? String(index)}
          label={item.label}
          value={item.value}
          description={item.description}
          highlight={item.highlight ?? index === 0}
        />
      ))}
    </dl>
  );
}

/** Deret statistik menonjol */
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
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="mt-0.5 text-2xl font-heading font-semibold tabular-nums text-foreground">
            {item.value}
          </dd>
          {item.description != null && (
            <dd className="text-xs text-muted-foreground">
              {item.description}
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/** Daftar statistik densitas rapat */
export function StatRow({ items, className }: StatPrimitivesProps) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {items.map((item, index) => (
        <div
          key={item.key ?? index}
          className="flex items-baseline justify-between gap-4 py-2.5"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-right">
            <span className="text-lg font-heading font-semibold tabular-nums text-foreground">
              {item.value}
            </span>
            {item.description != null && (
              <span className="ml-2 text-xs text-muted-foreground">
                {item.description}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
