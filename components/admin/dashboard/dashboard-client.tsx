"use client";

import Link from "next/link";
import { ArrowRight, FolderOpen, Compass, ClipboardList, Mail } from "lucide-react";
import { FEATURES } from "@/config/feature";

interface ModuleCard {
  title: string;
  description: string;
  href: string;
  icon: typeof FolderOpen;
  color: string;
}

const modules: (ModuleCard | false)[] = [
  FEATURES.CONTENT && {
    title: "Konten",
    description: "Kelola berita, kategori, halaman, dan media.",
    href: "/admin/content",
    icon: FolderOpen,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
  },
  FEATURES.FALAK && {
    title: "Falak",
    description: "Jadwal shalat, hisab, rukyat, dan eclipse.",
    href: "/admin/falak",
    icon: Compass,
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
  },
  FEATURES.PROGRAM && {
    title: "Program",
    description: "Daftar program, peserta, dan jadwal kegiatan.",
    href: "/admin/program",
    icon: ClipboardList,
    color: "text-violet-600 bg-violet-50 dark:bg-violet-950/50",
  },
  FEATURES.SECRETARIAT && {
    title: "Sekretariat",
    description: "Surat masuk, keluar, disposisi, dan dokumen.",
    href: "/admin/secretariat",
    icon: Mail,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
  },
];

export function DashboardClient() {
  const enabled = modules.filter(Boolean) as ModuleCard[];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pilih modul yang ingin dikelola.
        </p>
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
