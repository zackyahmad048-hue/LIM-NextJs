import { toHijri } from "hijri-converter";

import { cn } from "@/lib/utils";

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

interface DateChipProps {
  className?: string;
}

/** Chip tanggal hari ini: Masehi + Hijriah. */
export function DateChip({ className }: DateChipProps) {
  const now = new Date();
  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const gregorian = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  return (
    <div
      className={cn(
        "items-center gap-2 rounded-full border border-admin-border/50 bg-admin-border/30 px-3 py-1",
        className,
      )}
    >
      <span className="text-xs font-medium tabular-nums text-admin-content-fg">
        {gregorian}
      </span>
      <span aria-hidden className="h-3 w-px bg-admin-border" />
      <span className="font-data text-[11px] uppercase tabular-nums tracking-wide text-admin-content-fg/60">
        {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
      </span>
    </div>
  );
}
