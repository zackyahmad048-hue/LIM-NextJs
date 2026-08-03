"use client";

import { useMemo, useState } from "react";

import { Download, Printer } from "lucide-react";

import { toCsvExport } from "@/modules/twk/application/service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { MemberRow, TwkReportStats } from "./types";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  members: MemberRow[];
  stats: TwkReportStats;
}

function BreakdownSection({
  title,
  counts,
}: {
  title: string;
  counts: Record<string, number>;
}) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada data untuk {title.toLowerCase()}.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, count]) => (
        <Badge key={key} variant="secondary" className="gap-1.5 px-2.5 py-1">
          {key}
          <span className="rounded bg-background px-1 text-[11px]">
            {count}
          </span>
        </Badge>
      ))}
    </div>
  );
}

export function ReportDialog({ open, onOpenChange, members, stats }: Props) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) =>
      [member.nama, member.kelas, member.posWajibKhidmah, member.tempatWajibKhidmah]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }, [members, filter]);

  function handleExportCsv() {
    const csv = toCsvExport(filtered);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `laporan-wajib-khidmah-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Laporan Wajib Khidmah</DialogTitle>

          <DialogDescription>
            Ringkasan data anggota dan daftar lengkap. Gunakan tombol cetak
            atau ekspor CSV untuk mengunduh.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button size="sm" onClick={handleExportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>

          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Cetak
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Total Anggota</p>
              <p className="mt-1 text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Kelas</p>
              <p className="mt-1 text-3xl font-bold">
                {Object.keys(stats.perKelas).length}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Pos</p>
              <p className="mt-1 text-3xl font-bold">
                {Object.keys(stats.perPos).length}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Tempat</p>
              <p className="mt-1 text-3xl font-bold">
                {Object.keys(stats.perTempat).length}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Per Kelas</Label>
            <BreakdownSection title="Kelas" counts={stats.perKelas} />
          </div>

          <div className="space-y-3">
            <Label>Per Pos</Label>
            <BreakdownSection title="Pos" counts={stats.perPos} />
          </div>

          <div className="space-y-3">
            <Label>Per Tempat</Label>
            <BreakdownSection title="Tempat" counts={stats.perTempat} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label>Daftar Anggota</Label>
              <Input
                className="w-full max-w-xs"
                placeholder="Cari anggota..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <ScrollArea className="h-72 rounded-lg border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">No.</th>
                    <th className="px-3 py-2 text-left font-medium">Nama</th>
                    <th className="px-3 py-2 text-left font-medium">Kelas</th>
                    <th className="px-3 py-2 text-left font-medium">Pos</th>
                    <th className="px-3 py-2 text-left font-medium">Tempat</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                        Tidak ada data.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((member, index) => (
                      <tr key={member.id} className="border-t">
                        <td className="px-3 py-2 text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 font-medium">{member.nama}</td>
                        <td className="px-3 py-2">
                          {member.kelas ?? (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {member.posWajibKhidmah ?? (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {member.tempatWajibKhidmah ?? (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
