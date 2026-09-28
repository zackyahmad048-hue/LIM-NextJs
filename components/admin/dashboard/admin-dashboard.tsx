import Link from "next/link";
import { Download, LayoutDashboard, FolderOpen, Compass, ClipboardList, Mail, UsersRound, Info, FileBarChart, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Band } from "@/components/admin/shared/band";
import { StatGrid } from "@/components/admin/shared/stat-primitives";
import { DashboardEmptyState } from "@/components/admin/shared/empty-state";
import { PreviewDialog } from "@/components/admin/structure/preview.dialog";
import { filterNavigation } from "@/modules/authorization/application/permission-nav";

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

interface Props {
  user: DashboardUser;
  structure: StructureData;
  roleSlugs: string[];
}

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Beranda: GalleryHorizontalEnd,
  Konten: FolderOpen,
  Falak: Compass,
  Program: ClipboardList,
  Sekretariat: Mail,
  TWK: UsersRound,
  Profil: Info,
  Laporan: FileBarChart,
  Sistem: Settings,
};

import { GalleryHorizontalEnd } from "lucide-react";

function getModuleIcon(title: string) {
  const Icon = MODULE_ICONS[title] || LayoutDashboard;
  return <Icon className="size-5" />;
}

export function AdminDashboard({ user, structure, roleSlugs }: Props) {
  const totalCentralBoard = structure.centralBoard.length;
  const totalRegionalBoards = structure.regionalBoards.length;
  const totalBranchBoards = structure.branchBoards.length;
  const totalMembers = structure.members.length;

  const navigation = filterNavigation(roleSlugs);
  const modules = navigation.filter((item) => item.href && !item.pin);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={`Selamat datang, ${user.name}`}
        description="Pilih modul pada panel kiri untuk mengelola konten."
        actions={<Badge variant="secondary">{user.roleLabel}</Badge>}
      />

      {modules.length === 0 ? (
        <DashboardEmptyState
          title="Belum ada akses modul"
          description="Anda tidak memiliki izin untuk mengakses modul manapun. Hubungi administrator untuk mendapatkan akses."
        />
      ) : (
        <>
          <section aria-label="Modul" className="space-y-4">
            <h2 className="font-heading text-sm font-semibold text-admin-content-fg/60 uppercase tracking-wider">
              Modul Tersedia
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href!}
                  className="group bg-admin-card-bg border border-admin-card-border rounded-xl p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-admin-content-bg"
                >
                  <div className="flex items-center gap-3 text-admin-content-fg">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-admin-border/30 group-hover:bg-primary/10 transition-colors">
                      {getModuleIcon(module.title)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-semibold truncate">{module.title}</h3>
                      {module.description && (
                        <p className="text-xs text-admin-content-fg/60 truncate">{module.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <Band
            title="Struktur & Anggota"
            description="Ringkasan struktur kepengurusan dan anggota di semua tingkatan."
            actions={
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/profil/pengurus-pusat">Kelola</Link>
              </Button>
            }
          >
            <StatGrid
              items={[
                { label: "Pengurus Pusat", value: totalCentralBoard.toLocaleString("id-ID"), highlight: true },
                { label: "Wilayah", value: totalRegionalBoards.toLocaleString("id-ID") },
                { label: "Cabang", value: totalBranchBoards.toLocaleString("id-ID") },
                { label: "Anggota", value: totalMembers.toLocaleString("id-ID") },
              ]}
            />

            {structure.googleSheetUrl && (
              <div className="mt-5 flex items-center gap-2 border-t border-admin-border/60 pt-5">
                <div className="flex h-8 flex-1 items-center gap-2 rounded-md bg-admin-input-bg px-3">
                  <Download className="size-3.5 shrink-0 text-admin-content-fg/50" />
                  <span className="truncate font-data text-xs text-admin-content-fg/60">
                    {structure.googleSheetUrl}
                  </span>
                </div>
                <PreviewDialog initialUrl={structure.googleSheetUrl} />
              </div>
            )}
          </Band>

          {structure.organization && (
            <Band
              title="Profil Organisasi"
              description="Visi dan misi Lembaga Ittihadul Muballighin."
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading text-sm font-semibold text-admin-content-fg">Visi</h3>
                  <p className="mt-1.5 text-sm text-admin-content-fg/80 line-clamp-3">
                    {structure.organization.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-admin-content-fg">Misi</h3>
                  <ul className="mt-1.5 space-y-1.5 text-sm text-admin-content-fg/80">
                    {structure.organization.shortName && (
                      <li className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                        {structure.organization.shortName}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Band>
          )}
        </>
      )}
    </div>
  );
}