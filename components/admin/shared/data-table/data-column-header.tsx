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
      className="px-0 hover:bg-transparent"
      onClick={() =>
        column.toggleSorting(column.getIsSorted() === "asc")
      }
    >
      {title}

      {column.getIsSorted() === "asc" && (
        <ArrowUp className="ml-2 h-4 w-4" />
      )}

      {column.getIsSorted() === "desc" && (
        <ArrowDown className="ml-2 h-4 w-4" />
      )}

      {!column.getIsSorted() && (
        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}