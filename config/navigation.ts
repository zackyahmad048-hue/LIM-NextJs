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
  Moon,
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

    items: [
      {
        title: "Hero Carousel",
        icon: GalleryHorizontalEnd,
        href: "/admin/homepage/hero",
      },
      {
        title: "Tentang Kami",
        icon: Info,
        href: "/admin/homepage/about",
      },
    ],
  },

  FEATURES.CONTENT && {
    title: "Konten",
    icon: FolderOpen,

    items: [
      {
        title: "Kategori",
        icon: FolderTree,
        href: "/admin/content/categories",
      },
      {
        title: "Berita",
        icon: Newspaper,
        href: "/admin/content/posts",
      },
      {
        title: "Halaman",
        icon: FileText,
        href: "/admin/content/pages",
      },
      {
        title: "Media",
        icon: Image,
        href: "/admin/content/media",
      },
    ],
  },

  FEATURES.FALAK && {
    title: "Falak",
    icon: Compass,

    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/falak",
      },
      {
        title: "Jadwal Shalat",
        icon: Clock,
        href: "/admin/falak/prayer-time",
      },
      {
        title: "Hisab",
        icon: Calculator,
        href: "/admin/falak/hisab",
      },
      {
        title: "Rukyat",
        icon: Eye,
        href: "/admin/falak/rukyat",
      },
      {
        title: "Eclipse",
        icon: Eclipse,
        href: "/admin/falak/eclipse",
      },
      {
        title: "Imsakiyah",
        icon: Moon,
        href: "/admin/falak/imsakiyah",
      },
    ],
  },

  FEATURES.PROGRAM && {
    title: "Program",
    icon: ClipboardList,

    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/program",
      },
      {
        title: "Daftar Program",
        icon: Calendar,
        href: "/admin/program/list",
      },
      {
        title: "Peserta",
        icon: UserPlus,
        href: "/admin/program/participants",
      },
    ],
  },

  FEATURES.SECRETARIAT && {
    title: "Sekretariat",
    icon: Mail,
    href: "/admin/secretariat",
  },

  FEATURES.STRUCTURE && {
    title: "Struktur",
    icon: Building2,
    href: "/admin/structure",
  },

  FEATURES.REPORTS && {
    title: "Laporan",
    icon: FileBarChart,
    href: "/admin/reports",
  },

  FEATURES.SYSTEM && {
    title: "Sistem",
    icon: Settings,

    items: [
      {
        title: "Users",
        icon: Users,
        href: "/admin/system/users",
      },
      {
        title: "Roles",
        icon: Shield,
        href: "/admin/system/roles",
      },
    ],
  },
];

export const NAVIGATION: NavigationItem[] = rawNav.filter(
  (item): item is NavigationItem => Boolean(item),
);
