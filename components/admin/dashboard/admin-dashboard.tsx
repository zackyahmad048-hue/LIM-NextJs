import Link from "next/link";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatStrip, StatRow } from "@/components/admin/shared/stat-primitives";
import { ListRow } from "@/components/admin/shared/list-row";
import { PreviewDialog } from "@/components/admin/structure/preview.dialog";

interface DashboardUser {
  name: string;
  email: string;
  image: string | null;
  roleLabel: string;
}

interface BoardMember {
  id: string;
  name: string;
  position: string;
  image: string;
  sortOrder: number;
}

interface RegionalBoard {
  id: string;
  province: string;
  name: string;
  members: BoardMember[];
}

interface BranchBoard {
  id: string;
  province: string;
  regency: string;
  name: string;
  members: BoardMember[];
}

interface StructureData {
  organization: {
    name: string;
    shortName: string;
  };
  googleSheetUrl: string;
  centralBoard: BoardMember[];
  regionalBoards: RegionalBoard[];
  branchBoards: BranchBoard[];
  members: BoardMember[];
}

interface ProfilData {
  headerTitle: string;
  headerDescription: string;
  visi: string;
  misi: string[];
}

interface Props {
  user: DashboardUser;
  structure: StructureData;
  profil: ProfilData;
}

export function AdminDashboard({ user, structure, profil }: Props) {
  const totalCentralBoard = structure.centralBoard.length;
  const totalRegionalBoards = structure.regionalBoards.length;
  const totalBranchBoards = structure.branchBoards.length;
  const totalMembers = structure.members.length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`Selamat datang, ${user.name}`}
        description="Pilih modul pada panel kiri untuk mengelola konten."
        actions={<Badge variant="secondary">{user.roleLabel}</Badge>}
      />

      <Band
        title="Struktur & Anggota"
        description="Ringkasan struktur kepengurusan dan anggota di semua tingkatan."
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/profil/pengurus-pusat">Kelola</Link>
          </Button>
        }
      >
        <StatStrip
          items={[
            { label: "Pengurus Pusat", value: totalCentralBoard },
            { label: "Wilayah", value: totalRegionalBoards },
            { label: "Cabang", value: totalBranchBoards },
            { label: "Anggota", value: totalMembers },
          ]}
        />

        {structure.googleSheetUrl && (
          <div className="mt-5 flex items-center gap-2 border-t border-admin-border/60 pt-5">
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg bg-admin-input-bg px-3">
              <Download className="size-3.5 shrink-0 text-admin-content-fg/50" />
              <span className="truncate text-xs text-admin-content-fg/60">
                {structure.googleSheetUrl}
              </span>
            </div>
            <PreviewDialog initialUrl={structure.googleSheetUrl} />
          </div>
        )}
      </Band>

      <section aria-labelledby="dashboard-profil">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="dashboard-profil"
              className="text-base font-semibold text-admin-content-fg"
            >
              Profil
            </h2>
            <p className="mt-1 text-sm text-admin-content-fg/60">
              Visi dan misi organisasi pada laman publik.
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/content/pages/page:profil">Kelola</Link>
          </Button>
        </div>

        <div className="max-w-2xl">
          <StatRow
            items={[{ label: "Poin misi", value: profil.misi.length }]}
          />
        </div>

        <ul className="max-w-2xl divide-y divide-admin-border/50">
          <ListRow
            title="Visi"
            description={
              profil.visi.length > 120
                ? `${profil.visi.slice(0, 120)}...`
                : profil.visi
            }
          />
          {profil.misi.slice(0, 3).map((item, index) => (
            <ListRow
              key={item}
              title={`Misi ${index + 1}`}
              description={item.length > 60 ? `${item.slice(0, 60)}...` : item}
            />
          ))}
          {profil.misi.length > 3 && (
            <li className="py-3">
              <p className="text-xs text-admin-content-fg/50">
                +{profil.misi.length - 3} poin misi lainnya
              </p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}