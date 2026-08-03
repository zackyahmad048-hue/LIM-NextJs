export interface HomeGridConfig {
  title: string;
  description?: string;
  categorySlug: string;
  limit: number;
  href: string;
  hrefLabel: string;
}

export const HOME_GRIDS: HomeGridConfig[] = [
  {
    title: "Berita Terbaru",
    description: "Kabar dan kegiatan terbaru dari LIM di seluruh Indonesia.",
    categorySlug: "berita",
    limit: 6,
    href: "/artikel",
    hrefLabel: "Lihat Semua",
  },
  {
    title: "Kajian & Artikel",
    description: "Tulisan keislaman dan kajian dari para muballigh.",
    categorySlug: "artikel",
    limit: 6,
    href: "/artikel",
    hrefLabel: "Lihat Semua",
  },
];
