import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormGroupProps {
  legend: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Grup field form di dalam satu `band` — `fieldset` dengan `border-t` sebagai
 * pemisah antar grup; grup pertama otomatis tanpa `border-t` (F1). */
export function FormGroup({
  legend,
  description,
  children,
  className,
}: FormGroupProps) {
  return (
    <fieldset
      className={cn(
        "border-t border-admin-border/60 pb-5 first:border-t-0",
        className,
      )}
    >
      <legend className="mb-3 w-full text-base font-semibold text-admin-content-fg">
        {legend}
      </legend>
      {description != null && (
        <p className="-mt-1 mb-4 text-sm text-admin-content-fg/60">{description}</p>
      )}
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}