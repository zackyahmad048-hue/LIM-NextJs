"use client";

import { useMemo, useState } from "react";

import {
  BarChart3,
  Upload,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Band } from "@/components/admin/shared/band";
import { StatStrip } from "@/components/admin/shared/stat-primitives";

import { ImportDialog } from "./import.dialog";
import { MemberDialog } from "./member.dialog";
import { ReportDialog } from "./report.dialog";
import { MemberTable } from "./table";
import type { MemberRow, TwkReportStats } from "./types";

interface Props {
  members: MemberRow[];
  stats: TwkReportStats;
}

export function TwkModule({ members, stats }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberRow>();
  const [importOpen, setImportOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [hideNonActive, setHideNonActive] = useState(false);

  const visibleMembers = useMemo(() => {
    if (!hideNonActive) return members;
    return members.filter((m) => m.status === "AKTIF");
  }, [members, hideNonActive]);

  const activeCount = useMemo(
    () => members.filter((m) => m.status === "AKTIF").length,
    [members],
  );
  const inactiveCount = members.length - activeCount;

  function handleCreate() {
    setSelectedMember(undefined);
    setDialogOpen(true);
  }

  function handleEdit(member: MemberRow) {
    setSelectedMember(member);
    setDialogOpen(true);
  }

  return (
    <>
      <Band>
        <StatStrip
          items={[
            {
              key: "total",
              label: "Total Anggota",
              value: stats.total,
              description: hideNonActive
                ? `${visibleMembers.length} ditampilkan`
                : "Termasuk anggota non-aktif",
            },
            { key: "active", label: "Aktif", value: activeCount, description: "Sedang berjalan" },
            {
              key: "inactive",
              label: "Non-aktif",
              value: inactiveCount,
              description: "Gugur / Bebas Tugas / Qodlo",
            },
            {
              key: "pos",
              label: "Pos Khidmah",
              value: Object.keys(stats.perPos).length,
              description: "Pos unik yang tercatat",
            },
          ]}
        />
      </Band>

      <Band>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UsersRound className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Daftar anggota</h2>
              <p className="mt-1 text-xs text-admin-content-fg/60">
                {visibleMembers.length} dari {members.length} anggota
                ditampilkan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-1">
              <Checkbox
                id="hide-non-active"
                checked={hideNonActive}
                onCheckedChange={(checked) =>
                  setHideNonActive(checked === true)
                }
              />
              <Label
                htmlFor="hide-non-active"
                className="text-xs text-muted-foreground"
              >
                Sembunyikan non-aktif
              </Label>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setReportOpen(true)}
            >
              <BarChart3 className="size-4" />
              Laporan
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="size-4" />
              Impor
            </Button>

            <Button size="sm" onClick={handleCreate}>
              <UserPlus className="size-4" />
              Tambah anggota
            </Button>
          </div>
        </div>
      </Band>

      <Band>
        <MemberTable data={visibleMembers} onEdit={handleEdit} />
      </Band>

      <MemberDialog
        open={dialogOpen}
        member={selectedMember}
        onOpenChange={(value) => {
          setDialogOpen(value);
          if (!value) setSelectedMember(undefined);
        }}
      />

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        members={members}
        stats={stats}
      />
    </>
  );
}
