import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchForm({
  search,
  status,
}: {
  search: string;
  status?: string;
}) {
  return (
    <form method="get" className="flex items-center gap-2">
      <input type="hidden" name="status" value={status ?? ""} />
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Cari perihal, penerima, nomor..."
          className="h-8 w-56 pl-8 text-xs"
        />
      </div>
      {search && (
        <Button asChild variant="ghost" size="icon-sm">
          <a href={status ? `/admin/secretariat/outgoing-mail/list?status=${status}` : "/admin/secretariat/outgoing-mail/list"}>
            <X className="size-3.5" />
          </a>
        </Button>
      )}
    </form>
  );
}
