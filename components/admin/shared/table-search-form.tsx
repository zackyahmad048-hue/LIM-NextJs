import Link from "next/link";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TableSearchFormProps {
  basePath: string;
  defaultValue?: string;
  placeholder?: string;
  /** Param query tambahan yang harus tetap terkirim saat pencarian (mis. status). */
  hiddenParams?: Record<string, string | undefined>;
}

export function TableSearchForm({
  basePath,
  defaultValue,
  placeholder = "Cari...",
  hiddenParams,
}: TableSearchFormProps) {
  const activeHidden = Object.entries(hiddenParams ?? {}).filter(
    ([, value]) => value,
  );

  return (
    <form method="get" action={basePath} className="flex items-center gap-2">
      {activeHidden.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-admin-content-fg/40" />
        <label htmlFor="table-search" className="sr-only">
          Cari data
        </label>
        <Input
          id="table-search"
          type="search"
          name="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-8 w-48 pl-8 text-xs sm:w-56 bg-admin-input-bg border-admin-input-border text-admin-content-fg placeholder:text-admin-content-fg/40 focus:border-primary focus:ring-primary/20"
        />
      </div>
      {defaultValue && (
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          aria-label="Hapus pencarian"
          className="text-admin-content-fg/60 hover:text-admin-content-fg hover:bg-admin-border"
        >
          <Link href={basePath}>
            <X className="size-3.5" />
          </Link>
        </Button>
      )}
    </form>
  );
}
