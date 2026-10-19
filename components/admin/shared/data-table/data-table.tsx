"use client";

import * as React from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { DataToolbar } from "./data-toolbar";
import { DataPagination } from "./data-pagination";
import { DataEmpty } from "./data-empty";
import { DataError } from "./data-error";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Mode muat: render baris skeleton, bukan data. */
  loading?: boolean;
  /** Mode gagal: render DataError, bukan data. `onRetry` untuk tombol coba lagi. */
  error?: boolean;
  onRetry?: () => void;
  /** Server-side pagination: teruskan `pageCount`, `pageIndex`, dan
   *  `onPaginationChange`. Data sudah dipotong oleh server. */
  manualPagination?: boolean;
  pageCount?: number;
  pageIndex?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
  /** Pesan kustom saat data kosong (override default "Belum ada data"). */
  emptyMessage?: string;
  /** Deskripsi kustom saat data kosong; isi `""` untuk menyembunyikan subjudul
   *  default pada tabel read-only. */
  emptyDescription?: string;
  /** Aksi opsional saat data kosong (mis. Link ke halaman baru). */
  emptyAction?: React.ReactNode;
  /** Tampilkan toolbar pencarian klien. Matikan bila halaman sudah punya
   *  pencarian server (mis. `TableSearchForm`) agar tidak ada dua kotak cari. */
  showToolbar?: boolean;
}

const SKELETON_ROWS = 5;

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  error,
  onRetry,
  manualPagination,
  pageCount,
  pageIndex,
  onPaginationChange,
  emptyMessage,
  emptyDescription,
  emptyAction,
  showToolbar = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [clientPagination, setClientPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = React.useMemo<PaginationState>(
    () =>
      manualPagination
        ? { pageIndex: pageIndex ?? 0, pageSize: clientPagination.pageSize }
        : clientPagination,
    [manualPagination, pageIndex, clientPagination],
  );

  const handlePaginationChange: typeof setClientPagination = React.useCallback(
    (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (current: PaginationState) => PaginationState)(pagination)
          : updater;
      if (manualPagination) onPaginationChange?.(next.pageIndex, next.pageSize);
      else setClientPagination(next);
    },
    [manualPagination, onPaginationChange, pagination],
  );

  // TanStack Table exposes stateful helpers that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: handlePaginationChange,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    manualPagination: manualPagination ?? false,
    pageCount: manualPagination ? pageCount : undefined,
  });

  const emptyState = (
    <DataEmpty
      message={emptyMessage}
      description={emptyDescription}
      action={emptyAction}
    />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar disembunyikan saat data kosong (spec §4) dan saat halaman
       *  memakai pencarian server (`showToolbar={false}`). */}
      {showToolbar && data.length > 0 && (
        <DataToolbar value={globalFilter} onChange={setGlobalFilter} />
      )}

      {error ? (
        <div className="rounded-xl border border-admin-border bg-admin-card-bg">
          <DataError onRetry={onRetry} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-admin-border bg-admin-card-bg" role="region" tabIndex={0} aria-label="Tabel data">
            {/* Mobile (<sm): baris tertumpuk label:nilai, tanpa scroll horizontal. */}
            <ul className="divide-y divide-admin-border/50 sm:hidden" role="status" aria-busy={loading}>
              {loading
                ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <li key={i} className="space-y-2 p-4">
                      {columns.map((_, j) => (
                        <div key={j} className="h-4 w-3/4 rounded bg-admin-border/30 animate-pulse" />
                      ))}
                    </li>
                  ))
                : table.getRowModel().rows.length === 0
                  ? <li>{emptyState}</li>
                  : table.getRowModel().rows.map((row) => (
                      <li key={row.id} className="p-4">
                        <div className="space-y-2">
                          {row.getVisibleCells().map((cell) => {
                            const label =
                              typeof cell.column.columnDef.header === "string"
                                ? cell.column.columnDef.header
                                : null;
                            return (
                              <div key={cell.id} className="flex flex-col gap-0.5">
                                {label != null && (
                                  <span className="text-xs text-admin-content-fg/60">{label}</span>
                                )}
                                <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    ))}
            </ul>

            {/* Desktop (>=sm): tabel biasa. */}
            <table className="hidden w-full min-w-160 sm:table">
              <thead className="bg-admin-border/20">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-medium text-admin-content-fg/70"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody aria-busy={loading}>
                {loading ? (
                  Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <tr key={i} className="border-t border-admin-border/50" role="status">
                      {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 w-3/4 rounded bg-admin-border/30 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length}>{emptyState}</td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-admin-border/50 cursor-pointer hover:bg-admin-border/40 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DataPagination table={table} />
        </>
      )}
    </div>
  );
}
