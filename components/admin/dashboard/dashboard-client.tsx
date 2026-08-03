"use client";

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
} from "lucide-react";
import { FEATURES } from "@/config/feature";
import { hasAnyPermission } from "@/modules/authorization/application/permission.service";
import { DEFAULT_PERMISSION_MATRIX } from "@/modules/authorization/application/permission.matrix";

interface DashboardUser {
  name: string;
  email: string;
  image: string | null;
  roleLabel: string;
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
    title: "Struktur",
    description: "Kelola struktur organisasi.",
    href: "/admin/structure",
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

interface Props {
  user: DashboardUser;
  roleSlugs: string[];
}

export function DashboardClient({ user, roleSlugs }: Props) {
  const enabled = modules.filter((mod): mod is ModuleCard => {
    if (!mod) return false;
    return hasAnyPermission(
      roleSlugs,
      mod.permissions,
      DEFAULT_PERMISSION_MATRIX,
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
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
          <h1 className="text-xl font-bold tracking-tight">
            Selamat datang, {user.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Anda masuk sebagai {user.roleLabel}. Pilih modul yang ingin
            dikelola.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {enabled.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${mod.color}`}
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
    </div>
  );
}
