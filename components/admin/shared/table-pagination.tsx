import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  /** Query params lain yang dipertahankan saat berpindah halaman (mis. search, status). */
  queryParams?: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  queryParams: Record<string, string | undefined> | undefined,
  page: number
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams ?? {})) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function TablePagination({
  page,
  pageSize,
  total,
  basePath,
  queryParams,
}: TablePaginationProps) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(total, currentPage * pageSize);

  return (
    <nav
      aria-label="Navigasi halaman tabel"
      className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
    >
      <p className="text-xs text-muted-foreground tabular-nums">
        Menampilkan {start}&ndash;{end} dari {total}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs tabular-nums text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </span>
        {currentPage > 1 ? (
          <Button asChild variant="outline" size="sm" className="h-8 px-2.5">
            <Link
              href={buildHref(basePath, queryParams, currentPage - 1)}
              aria-label="Ke halaman sebelumnya"
            >
              <ChevronLeft className="size-3.5" />
              Sebelumnya
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 px-2.5" disabled>
            <ChevronLeft className="size-3.5" />
            Sebelumnya
          </Button>
        )}
        {currentPage < totalPages ? (
          <Button asChild variant="outline" size="sm" className="h-8 px-2.5">
            <Link
              href={buildHref(basePath, queryParams, currentPage + 1)}
              aria-label="Ke halaman berikutnya"
            >
              Berikutnya
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 px-2.5" disabled>
            Berikutnya
            <ChevronRight className="size-3.5" />
          </Button>
        )}
      </div>
    </nav>
  );
}
