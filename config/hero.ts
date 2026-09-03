import type { HeroConfig } from "@/types/hero";

export const HERO_CONFIG_SETTING_KEY = "homepage.hero";

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  eyebrow: "",
  title: "Memesantrenkan Masyarakat",
  highlight: "Memasyarakatkan Pesantren,",
  tagline: "",
  description:
    "Membangun peradaban umat melalui dakwah, pendidikan, dan pemberdayaan muballigh di Indonesia.",
  image: "/images/iksadari.JPG",
  ctaLabel: "Jadwal Shalat Hari Ini",
  ctaHref: "/falak/jadwal-shalat",
  secondaryLabel: "Selengkapnya",
  secondaryHref: "/profil",
  statCards: [
    { value: "100+", label: "Wilayah dan cabang" },
    { value: "3000+", label: "Delegasi Ramadan" },
    { value: "1000+", label: "Titik dakwah" },
  ],
};
