import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FolderOpen,
  Compass,
  ClipboardList,
  Mail,
  UsersRound,
  Building2,
  FileBarChart,
  BookOpen,
  Download,
  LayoutDashboard,
} from "lucide-react";
import { FEATURES } from "@/config/feature";
import { hasAnyPermission } from "@/modules/authorization/application/permission.service";
import { DEFAULT_PERMISSION_MATRIX } from "@/modules/authorization/application/permission.matrix";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PreviewDialog } from "@/components/admin/structure/preview.dialog";
import { SectionCard } from "@/components/admin/shared/section-card";
import { DashboardEmptyState } from "@/components/admin/shared/empty-state";
import { cn } from "@/lib/utils";

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

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: typeof FolderOpen;
  permissions: string[];
}

const modules: (ModuleCard | false)[] = [
  FEATURES.CONTENT && {
    title: "Konten",
    description: "Kelola berita, kategori, halaman, dan media.",
    href: "/admin/content",
    icon: FolderOpen,
    permissions: ["content.post.read"],
  },
  FEATURES.FALAK && {
    title: "Falak",
    description: "Jadwal shalat, hisab, rukyat, dan eclipse.",
    href: "/admin/falak",
    icon: Compass,
    permissions: ["falak.prayer-time.view"],
  },
  FEATURES.PROGRAM && {
    title: "Program",
    description: "Daftar program, peserta, dan jadwal kegiatan.",
    href: "/admin/program",
    icon: ClipboardList,
    permissions: ["program.view"],
  },
  FEATURES.TWK && {
    title: "TWK",
    description: "Kelola data anggota Wajib Khidmah.",
    href: "/admin/twk",
    icon: UsersRound,
    permissions: ["twk.member.view"],
  },
  FEATURES.SECRETARIAT && {
    title: "Sekretariat",
    description: "Surat masuk, keluar, disposisi, dan dokumen.",
    href: "/admin/secretariat",
    icon: Mail,
    permissions: ["secretariat.view"],
  },
  FEATURES.STRUCTURE && {
    title: "Profil",
    description: "Kelola profil organisasi dan struktur AD/ART.",
    href: "/admin/profil/pengurus-pusat",
    icon: Building2,
    permissions: ["structure.view"],
  },
  FEATURES.REPORTS && {
    title: "Laporan",
    description: "Ringkasan dan laporan organisasi.",
    href: "/admin/reports",
    icon: FileBarChart,
    permissions: ["reports.view"],
  },
];

interface ProfilData {
  headerTitle: string;
  headerDescription: string;
  visi: string;
  misi: string[];
}

interface Props {
  user: DashboardUser;
  roleSlugs: string[];
  structure: StructureData;
  profil: ProfilData;
}

export function DashboardClient({ user, roleSlugs, structure, profil }: Props) {
  const enabled = modules.filter((mod): mod is ModuleCard => {
    if (!mod) return false;
    return hasAnyPermission(
      roleSlugs,
      mod.permissions,
      DEFAULT_PERMISSION_MATRIX,
    );
  });

  const totalCentralBoard = structure.centralBoard.length;
  const totalRegionalBoards = structure.regionalBoards.length;
  const totalBranchBoards = structure.branchBoards.length;
  const totalMembers = structure.members.length;

  return (
    <div className="flex flex-col gap-4">
      <SectionCard variant="elevated" className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="font-heading text-xl font-bold">
                  Selamat datang, {user.name}
                </h1>
                <Badge variant="secondary">{user.roleLabel}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Pilih modul yang ingin dikelola.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {enabled.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {enabled.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className={cn(
                  "group flex flex-col items-start gap-3 rounded-xl p-5 transition-all duration-300 ease-out",
                  // Solid card (SectionCard style) — no glassmorphism on module cards
                  "bg-admin-card-bg border-primary/25 shadow-sm",
                  "hover:shadow-md hover:border-primary hover:bg-primary/5",
                  "motion-safe:hover:-translate-y-0.5",
                  // Focus ring for accessibility
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-admin-content-bg",
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1 w-full">
                  <h2 className="font-heading text-base font-semibold text-card-foreground">
                    {mod.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      ) : (
        <DashboardEmptyState
          icon={LayoutDashboard}
          title="Belum ada modul tersedia"
          description="Anda belum memiliki akses ke modul manajemen manapun. Hubungi administrator untuk mendapatkan izin."
        />
      )}

      <SectionCard variant="elevated" className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-base font-semibold">Struktur & Anggota</h2>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/profil/pengurus-pusat">Kelola</Link>
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-admin-card-border">
          <MiniStat value={totalCentralBoard} label="Pengurus Pusat" />
          <MiniStat value={totalRegionalBoards} label="Wilayah" />
          <MiniStat value={totalBranchBoards} label="Cabang" />
          <MiniStat value={totalMembers} label="Anggota" />
        </div>

        {structure.googleSheetUrl && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 flex-1 items-center gap-2 rounded-lg bg-muted/50 px-3">
              <Download className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs text-muted-foreground">
                {structure.googleSheetUrl}
              </span>
            </div>
            <PreviewDialog initialUrl={structure.googleSheetUrl} />
          </div>
        )}
      </SectionCard>

      <SectionCard variant="elevated" className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-base font-semibold">Profil</h2>
            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
              {profil.misi.length} poin misi
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/content/pages/page:profil">Kelola</Link>
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Visi</p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              {profil.visi.length > 120
                ? `${profil.visi.slice(0, 120)}...`
                : profil.visi}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Misi</p>
            <ul className="mt-1 space-y-1">
              {profil.misi.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item.length > 60 ? `${item.slice(0, 60)}...` : item}
                </li>
              ))}
              {profil.misi.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{profil.misi.length - 3} poin lainnya
                </li>
              )}
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="pr-4 sm:px-4 sm:first:pl-0">
      <p className="font-heading text-xl font-semibold tracking-[-0.01em] tabular-nums text-card-foreground stat-number">
        {value}
      </p>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
