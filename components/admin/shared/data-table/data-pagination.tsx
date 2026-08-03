"use client";

import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

interface Props<TData> {
  table: Table<TData>;
}

export function DataPagination<TData>({ table }: Props<TData>) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Sebelumnya
      </Button>

      <span className="text-sm text-muted-foreground">
        Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
        {table.getPageCount()}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Selanjutnya
      </Button>
    </div>
  );
}
