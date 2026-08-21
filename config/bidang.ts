export interface Bidang {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  points: string[];
}

export const BIDANG: Bidang[] = [
  {
    slug: "tim-wajib-khidmah",
    title: "Tim Wajib Khidmah",
    tagline: "Pengabdian muballigh dalam tugas wajib khidmah",
    description:
      "Tim Wajib Khidmah menghimpun dan mengatur para muballigh yang menjalankan tugas pengabdian (wajib khidmah) di berbagai wilayah, mulai dari penugasan, pendampingan, hingga pelaporan kegiatan.",
    points: [
      "Penugasan dan penjadwalan muballigh wajib khidmah",
      "Pendampingan tugas di lokasi penempatan",
      "Pembinaan dan evaluasi berkala",
      "Pelaporan dan dokumentasi kegiatan",
    ],
  },
  {
    slug: "safari-ramadan",
    title: "Safari Ramadan",
    tagline: "Dakwah keliling sepanjang bulan Ramadan",
    description:
      "Safari Ramadan menghadirkan para muballigh ke berbagai masjid dan musala untuk mengisi rangkaian ibadah Ramadan, dari tarawih, kajian, hingga kegiatan sosial bagi masyarakat.",
    points: [
      "Imam dan khatib tarawih keliling",
      "Kajian Ramadan tematik",
      "Pendampingan pesantren kilat",
      "Program sosial dan santunan",
    ],
  },
  {
    slug: "safari-dakwah-rutinan",
    title: "Safari Dakwah Rutinan",
    tagline: "Dakwah terjadwal sepanjang tahun",
    description:
      "Safari Dakwah Rutin menyalurkan muballigh ke daerah-daerah binaan secara terjadwal sepanjang tahun untuk menjaga keberlanjutan pembinaan umat di luar bulan Ramadan.",
    points: [
      "Ceramah dan pengajian rutin",
      "Pembinaan desa binaan",
      "Kerja sama dengan lembaga dakwah lokal",
      "Pemantauan dan evaluasi berkala",
    ],
  },
  {
    slug: "penelitian-pengembangan",
    title: "Penelitian & Pengembangan",
    tagline: "Riset dan inovasi keilmuan dakwah",
    description:
      "Bidang Penelitian & Pengembangan menjalankan riset keislaman, kajian lapangan, serta pengembangan metode dan materi dakwah agar program LIM selalu relevan dan berbasis data.",
    points: [
      "Riset dan kajian lapangan",
      "Pengembangan kurikulum dan materi dakwah",
      "Publikasi hasil penelitian",
      "Pengelolaan data dan dokumentasi program",
    ],
  },
  {
    slug: "pesantren-ramadan",
    title: "Pesantren Ramadan",
    tagline: "Pendidikan intensif di bulan suci",
    description:
      "Pesantren Ramadan menyelenggarakan pendidikan intensif bagi santri dan masyarakat selama Ramadan, memadukan ibadah, pembinaan akhlak, dan pendalaman ilmu agama.",
    points: [
      "Pesantren kilat untuk pelajar dan umum",
      "Pembinaan santri muda",
      "Tahsin dan tahfiz",
      "Program motivasi dan pendampingan",
    ],
  },
  {
    slug: "dakwah-digital",
    title: "Dakwah Digital",
    tagline: "Syiar melalui media dan teknologi",
    description:
      "Dakwah Digital memanfaatkan media sosial, situs, dan teknologi digital untuk memperluas jangkauan syiar, menghadirkan konten dakwah yang relevan bagi generasi digital.",
    points: [
      "Pengelolaan media sosial dan konten",
      "Produksi konten audio dan video",
      "Siaran dan kolaborasi digital",
      "Literasi digital bagi muballigh",
    ],
  },
  {
    slug: "pendidikan-kaderisasi",
    title: "Pendidikan & Kaderisasi",
    tagline: "Melahirkan muballigh profesional",
    description:
      "Bidang Pendidikan & Kaderisasi menyelenggarakan pelatihan, pembinaan, dan kaderisasi untuk mencetak muballigh yang kompeten, berintegritas, dan siap berdakwah di masyarakat.",
    points: [
      "Pelatihan dan pembekalan muballigh",
      "Kaderisasi muballigh muda",
      "Sertifikasi dan pengembangan kompetensi",
      "Pembinaan kepemimpinan organisasi",
    ],
  },
  {
    slug: "pemberdayaan-ekonomi",
    title: "Pemberdayaan Ekonomi",
    tagline: "Membangun kemandirian ekonomi umat",
    description:
      "Pemberdayaan Ekonomi menggerakkan program ekonomi umat melalui penguatan usaha, kemitraan, dan pengelolaan dana sosial agar dakwah berjalan beriringan dengan kesejahteraan.",
    points: [
      "Pengembangan usaha mikro dan UMKM",
      "Koperasi dan kemitraan usaha",
      "Pengelolaan zakat, infak, dan sedekah produktif",
      "Pelatihan dan pendampingan kewirausahaan",
    ],
  },
];

export function getBidangBySlug(slug: string): Bidang | undefined {
  return BIDANG.find((bidang) => bidang.slug === slug);
}
