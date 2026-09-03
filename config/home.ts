export interface HomepageSectionDescriptor {
  id: string;
  title: string;
  description: string;
  settingKey: string;
  adminHref: string;
  previewHref: string;
}

export const HOMEPAGE_SECTIONS: HomepageSectionDescriptor[] = [
  {
    id: "hero",
    title: "Hero",
    description:
      "Judul, moto, deskripsi, dan tombol ajakan pada bagian paling atas beranda.",
    settingKey: "homepage.hero",
    adminHref: "/admin/homepage/hero",
    previewHref: "/",
  },
  {
    id: "about",
    title: "Tentang Kami",
    description:
      "Section Selayang Pandang: judul, deskripsi, gambar, dan kartu fitur.",
    settingKey: "homepage.about",
    adminHref: "/admin/content/pages/homepage.about",
    previewHref: "/",
  },
];
