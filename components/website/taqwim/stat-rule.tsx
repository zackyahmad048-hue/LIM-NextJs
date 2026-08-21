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
        "grid grid-cols-3 divide-x divide-border border-y border-border",
        className,
      )}
    >
      {items.map((stat) => (
        <div key={stat.label} className="px-4 py-5 first:pl-0 last:pr-0">
          <dt className="font-data text-xl font-semibold leading-none tabular-nums text-foreground sm:text-2xl">
            {stat.value}
          </dt>
          <dd className="mt-2 text-[10px] font-medium uppercase text-muted-foreground">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}