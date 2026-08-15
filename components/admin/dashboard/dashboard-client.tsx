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
  Download,
} from "lucide-react";
import { FEATURES } from "@/config/feature";
import { hasAnyPermission } from "@/modules/authorization/application/permission.service";
import { DEFAULT_PERMISSION_MATRIX } from "@/modules/authorization/application/permission.matrix";
import { Button } from "@/components/ui/button";
import { toHijri } from "hijri-converter";
import { PreviewDialog } from "@/components/admin/structure/preview.dialog";
import { SectionCard } from "@/components/admin/shared/section-card";
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
  color: string;
  permissions: string[];
}

const modules: (ModuleCard | false)[] = [
  FEATURES.CONTENT && {
    title: "Konten",
    description: "Kelola berita, kategori, halaman, dan media.",
    href: "/admin/content",
    icon: FolderOpen,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-950/50",
    permissions: ["content.post.read"],
  },
  FEATURES.FALAK && {
    title: "Falak",
    description: "Jadwal shalat, hisab, rukyat, dan eclipse.",
    href: "/admin/falak",
    icon: Compass,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950/50",
    permissions: ["falak.prayer-time.view"],
  },
  FEATURES.PROGRAM && {
    title: "Program",
    description: "Daftar program, peserta, dan jadwal kegiatan.",
    href: "/admin/program",
    icon: ClipboardList,
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/50",
    permissions: ["program.view"],
  },
  FEATURES.TWK && {
    title: "TWK",
    description: "Kelola data anggota Wajib Khidmah.",
    href: "/admin/twk",
    icon: UsersRound,
    color: "text-primary/80 bg-primary/10 dark:bg-primary/20",
    permissions: ["twk.member.view"],
  },
  FEATURES.SECRETARIAT && {
    title: "Sekretariat",
    description: "Surat masuk, keluar, disposisi, dan dokumen.",
    href: "/admin/secretariat",
    icon: Mail,
    color: "text-stone-600 bg-stone-200 dark:bg-stone-800/60",
    permissions: ["secretariat.view"],
  },
  FEATURES.STRUCTURE && {
    title: "Profil",
    description: "Kelola profil organisasi dan struktur AD/ART.",
    href: "/admin/profil/pengurus-pusat",
    icon: Building2,
    color: "text-sky-600 bg-sky-100 dark:bg-sky-950/50",
    permissions: ["structure.view"],
  },
  FEATURES.REPORTS && {
    title: "Laporan",
    description: "Ringkasan dan laporan organisasi.",
    href: "/admin/reports",
    icon: FileBarChart,
    color: "text-violet-600 bg-violet-100 dark:bg-violet-950/50",
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

export function DashboardClient({
  user,
  roleSlugs,
  structure,
  profil,
}: Props) {
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
      <div className="flex items-center gap-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] p-5 backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="size-11 rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold">
            Selamat datang, {user.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Anda masuk sebagai {user.roleLabel}. Pilih modul
            yang ingin dikelola.
          </p>
          <DashboardDate />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {enabled.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex items-start gap-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] p-5 shadow-sm backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)] transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div
                className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", mod.color)}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-card-foreground">
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

      <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950/50">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">
              Struktur & Anggota
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalCentralBoard} Pengurus Pusat ·{" "}
              {totalRegionalBoards} Wilayah ·{" "}
              {totalBranchBoards} Cabang · {totalMembers}{" "}
              Anggota
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            asChild
          >
            <Link href="/admin/profil/pengurus-pusat">Kelola</Link>
          </Button>
        </div>

        {structure.googleSheetUrl && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-7 flex-1 items-center gap-2 rounded-md bg-muted/50 px-3">
              <Download className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs text-muted-foreground">
                {structure.googleSheetUrl}
              </span>
            </div>
            <PreviewDialog initialUrl={structure.googleSheetUrl} />
          </div>
        )}
      </SectionCard>

      <SectionCard variant="glass" className="rounded-lg p-4 shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-950/50">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">Profil</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {profil.misi.length} poin misi · visi diperbarui
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            asChild
          >
            <Link href="/admin/content/pages/page:profil">
              Kelola
            </Link>
          </Button>
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Visi
            </p>
            <p className="mt-1 text-sm leading-6 text-foreground">
              {profil.visi.length > 120
                ? `${profil.visi.slice(0, 120)}...`
                : profil.visi}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Misi
            </p>
            <ul className="mt-1 space-y-1">
              {profil.misi.slice(0, 3).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item.length > 60
                    ? `${item.slice(0, 60)}...`
                    : item}
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

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

function DashboardDate() {
  const now = new Date();
  const hijri = toHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const gregorian = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <p className="mt-1 font-data text-[11px] uppercase tabular-nums text-muted-foreground">
      {gregorian} · {hijri.hd} {HIJRI_MONTHS[hijri.hm - 1]} {hijri.hy} H
    </p>
  );
}
