import { cn } from "@/lib/utils";

export interface TaqwimStat {
  value: string;
  label: string;
}

interface StatRuleProps {
  items: TaqwimStat[];
  className?: string;
}

export default function StatRule({ items, className }: StatRuleProps) {
  if (!items.length) return null;

  return (
    <dl
      className={cn(
        "grid grid-cols-3 divide-x divide-border",
        className,
      )}
    >
      {items.map((stat) => (
        <div
          key={stat.label}
          className="px-5 py-6 first:pl-0 last:pr-0 sm:px-6"
        >
          <dt className="font-data text-2xl font-semibold leading-none tabular-nums text-foreground sm:text-3xl">
            {stat.value}
          </dt>
          <dd className="mt-2.5 text-[11px] font-medium uppercase leading-snug text-muted-foreground">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}