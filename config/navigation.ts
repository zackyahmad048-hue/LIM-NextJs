import {
  LayoutDashboard,
  FolderOpen,
  FolderTree,
  Newspaper,
  FileText,
  Image,
  GalleryHorizontalEnd,
  Building2,
  FileBarChart,
  Settings,
  Users,
  Shield,
  Info,
  Clock,
  Compass,
  Calculator,
  Eye,
  Eclipse,
  Calendar,
  ClipboardList,
  UserPlus,
  Mail,
  UsersRound,
} from "lucide-react";

import type { NavigationItem } from "@/types/navigation";
import { FEATURES } from "./feature";

const rawNav: (NavigationItem | false | undefined)[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },

  FEATURES.CONTENT && {
    title: "Beranda",
    icon: GalleryHorizontalEnd,
    permissions: ["content.post.read"],

    items: [
      {
        title: "Hero Carousel",
        icon: GalleryHorizontalEnd,
        href: "/admin/homepage/hero",
        permissions: ["content.post.read"],
      },
      {
        title: "Tentang Kami",
        icon: Info,
        href: "/admin/homepage/about",
        permissions: ["content.post.read"],
      },
    ],
  },

  FEATURES.CONTENT && {
    title: "Konten",
    icon: FolderOpen,
    permissions: ["content.post.read"],

    items: [
      {
        title: "Kategori",
        icon: FolderTree,
        href: "/admin/content/categories",
        permissions: ["content.post.read"],
      },
      {
        title: "Berita",
        icon: Newspaper,
        href: "/admin/content/posts",
        permissions: ["content.post.read"],
      },
      {
        title: "Halaman",
        icon: FileText,
        href: "/admin/content/pages",
        permissions: ["content.post.read"],
      },
      {
        title: "Media",
        icon: Image,
        href: "/admin/content/media",
        permissions: ["content.post.read"],
      },
    ],
  },

  FEATURES.FALAK && {
    title: "Falak",
    icon: Compass,
    permissions: ["falak.prayer-time.view"],

    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/falak",
        permissions: ["falak.prayer-time.view"],
      },
      {
        title: "Jadwal Shalat",
        icon: Clock,
        href: "/admin/falak/prayer-time",
        permissions: ["falak.prayer-time.view"],
      },
      {
        title: "Hisab",
        icon: Calculator,
        href: "/admin/falak/hisab",
        permissions: ["falak.hisab.view"],
      },
      {
        title: "Rukyat",
        icon: Eye,
        href: "/admin/falak/rukyat",
        permissions: ["falak.rukyat.view"],
      },
      {
        title: "Eclipse",
        icon: Eclipse,
        href: "/admin/falak/eclipse",
        permissions: ["falak.eclipse.view"],
      },
      {
        title: "Laporan",
        icon: FileBarChart,
        href: "/admin/falak/reports",
        permissions: ["falak.rukyat.view"],
      },
      {
        title: "Arsip",
        icon: FileText,
        href: "/admin/falak/archive",
        permissions: ["falak.rukyat.view"],
      },
    ],
  },

  FEATURES.PROGRAM && {
    title: "Program",
    icon: ClipboardList,
    permissions: ["program.view"],

    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/program",
        permissions: ["program.view"],
      },
      {
        title: "Daftar Program",
        icon: Calendar,
        href: "/admin/program/list",
        permissions: ["program.view"],
      },
      {
        title: "Peserta",
        icon: UserPlus,
        href: "/admin/program/participants",
        permissions: ["program.participant.view"],
      },
    ],
  },

  FEATURES.SECRETARIAT && {
    title: "Sekretariat",
    icon: Mail,
    href: "/admin/secretariat",
    permissions: ["secretariat.view"],
  },

  FEATURES.TWK && {
    title: "TWK",
    icon: UsersRound,
    href: "/admin/twk",
    permissions: ["twk.member.view"],
  },

  FEATURES.STRUCTURE && {
    title: "Struktur",
    icon: Building2,
    href: "/admin/structure",
    permissions: ["structure.view"],
  },

  FEATURES.REPORTS && {
    title: "Laporan",
    icon: FileBarChart,
    href: "/admin/reports",
    permissions: ["reports.view"],
  },

  FEATURES.SYSTEM && {
    title: "Sistem",
    icon: Settings,
    permissions: ["system.user.view", "system.role.view"],

    items: [
      {
        title: "Users",
        icon: Users,
        href: "/admin/system/users",
        permissions: ["system.user.view"],
      },
      {
        title: "Roles",
        icon: Shield,
        href: "/admin/system/roles",
        permissions: ["system.role.view"],
      },
    ],
  },
];

export const NAVIGATION: NavigationItem[] = rawNav.filter(
  (item): item is NavigationItem => Boolean(item),
);
