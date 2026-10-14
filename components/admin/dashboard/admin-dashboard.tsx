import Link from "next/link";
import { Download, Inbox, Plus, FileText, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  // Quick actions for common tasks
  const quickActions = [
    {
      title: "Tulis Surat Keluar",
      href: "/admin/secretariat/outgoing-mail/new",
      icon: <FileText className="size-4" />,
    },
    {
      title: "Catat Surat Masuk",
      href: "/admin/secretariat/incoming-mail/new",
      icon: <Inbox className="size-4" />,
    },
    {
      title: "Buat Program Baru",
      href: "/admin/program/new",
      icon: <Plus className="size-4" />,
    },
    {
      title: "Kelola Struktur",
      href: "/admin/profil/pengurus-pusat",
      icon: <Building2 className="size-4" />,
    },
  ];

  // Mock recent activity from structure data (placeholder for real query in Phase 2)
  const recentActivity = [
    {
      title: `${structure.members.length > 0 ? structure.members[0].name : "Anggota baru"} ditambahkan`,
      description: "Pengurus Pusat • Baru saja",
      meta: "Baru",
    },
    {
      title: `Wilayah ${structure.regionalBoards.length > 0 ? structure.regionalBoards[0].name : "Wilayah"} diperbarui`,
      description: "Struktur Wilayah • 2 jam lalu",
      meta: "Diperbarui",
    },
    {
      title: `Program ${structure.centralBoard.length > 0 ? structure.centralBoard[0].name : "Program"} dibuat`,
      description: "Manajemen Program • 1 hari lalu",
      meta: "Baru",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Welcome / Brand block */}
      <div className="bg-gradient-to-br from-orange-600/10 via-transparent to-transparent rounded-xl border border-orange-600/20 p-5 lg:p-8">
        <h1 className="font-heading text-2xl lg:text-3xl font-semibold tracking-tight text-admin-content-fg">
          Selamat datang, <span className="text-orange-600">{user.name}</span>
        </h1>
        <p className="mt-2 text-admin-content-fg/70 max-w-2xl">
          Kelola struktur organisasi, surat-menyurat, program, dan konten LIM dari satu dasbor.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{user.roleLabel}</Badge>
          <span className="text-xs text-admin-content-fg/60">LIM Digital Platform</span>
        </div>
      </div>

      {/* Stat Strip (inline, divider-row) */}
      <Band variant="plain" className="border-t-0 pt-0">
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

      {/* Quick Actions */}
      <Band variant="plain" title="Aksi Cepat" description="Tindakan paling sering digunakan.">
        <ul className="divide-y divide-admin-border/50">
          {quickActions.map((action) => (
            <ListRow
              key={action.title}
              title={action.title}
              action={
                <Button size="sm" variant="ghost" asChild>
                  <Link href={action.href} aria-label={action.title}>
                    {action.icon}
                  </Link>
                </Button>
              }
            />
          ))}
        </ul>
      </Band>

      {/* Profil / Visi Misi */}
      <Band variant="plain" title="Profil" description="Visi dan misi organisasi pada laman publik.">
        <div className="max-w-2xl">
          <StatRow items={[{ label: "Poin misi", value: profil.misi.length }]} />
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
          {profil.misi.slice(0, 3).map((item, idx) => (
            <ListRow
              key={idx}
              title={`Misi ${idx + 1}`}
              description={item.length > 60 ? `${item.slice(0, 60)}...` : item}
            />
          ))}
          {profil.misi.length > 3 && (
            <li className="py-3">
              <p className="text-xs text-admin-content-fg/80">
                +{profil.misi.length - 3} poin misi lainnya
              </p>
            </li>
          )}
        </ul>
      </Band>

      {/* Recent Activity */}
      <Band variant="plain" title="Aktivitas Terbaru" description="Perubahan terbaru di seluruh modul.">
        <ul className="divide-y divide-admin-border/50">
          {recentActivity.map((activity, idx) => (
            <ListRow
              key={idx}
              title={activity.title}
              description={activity.description}
              meta={activity.meta}
            />
          ))}
        </ul>
      </Band>
    </div>
  );
}