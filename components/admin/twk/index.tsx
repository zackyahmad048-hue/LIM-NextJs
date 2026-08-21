"use client";

import { useMemo, useState } from "react";

import {
  BarChart3,
  Briefcase,
  Upload,
  UserCheck,
  UserPlus,
  UserX,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { SectionCard } from "@/components/admin/shared/section-card";
import { StatCard } from "@/components/admin/shared/stat-card";

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Anggota"
          value={stats.total}
          icon={UsersRound}
          description={
            hideNonActive
              ? `${visibleMembers.length} ditampilkan`
              : "Termasuk anggota non-aktif"
          }
        />
        <StatCard
          title="Aktif"
          value={activeCount}
          icon={UserCheck}
          description="Sedang berjalan"
        />
        <StatCard
          title="Non-aktif"
          value={inactiveCount}
          icon={UserX}
          description="Gugur / Bebas Tugas / Qodlo"
        />
        <StatCard
          title="Pos Khidmah"
          value={Object.keys(stats.perPos).length}
          icon={Briefcase}
          description="Pos unik yang tercatat"
        />
      </div>

      <SectionCard className="rounded-lg bg-background p-4 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UsersRound className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Daftar anggota</h2>
              <p className="mt-1 text-xs text-muted-foreground">
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
      </SectionCard>

      <SectionCard className="rounded-lg bg-background p-0 shadow-none">
        <MemberTable data={visibleMembers} onEdit={handleEdit} />
      </SectionCard>

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
