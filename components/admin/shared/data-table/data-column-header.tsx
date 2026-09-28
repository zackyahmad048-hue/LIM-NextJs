"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataColumnHeader<TData, TValue>({
  column,
  title,
}: DataColumnHeaderProps<TData, TValue>) {
  return (
    <Button
      variant="ghost"
      className="px-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="flex items-center gap-1.5">
        {title}

        {column.getIsSorted() === "asc" && (
          <ArrowUp className="h-4 w-4 text-primary" aria-hidden="true" />
        )}

        {column.getIsSorted() === "desc" && (
          <ArrowDown className="h-4 w-4 text-primary" aria-hidden="true" />
        )}

        {!column.getIsSorted() && (
          <ChevronsUpDown className="h-4 w-4 text-admin-content-fg/40" aria-hidden="true" />
        )}
      </span>
    </Button>
  );
}