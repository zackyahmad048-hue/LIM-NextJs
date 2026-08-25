"use client";

import { DataTable } from "@/components/admin/shared/data-table";

import { getMemberColumns } from "./columns";
import type { MemberRow } from "./types";

interface Props {
  data: MemberRow[];
  onEdit(member: MemberRow): void;
}

export function MemberTable({ data, onEdit }: Props) {
  return <DataTable columns={getMemberColumns({ onEdit })} data={data} />;
}
