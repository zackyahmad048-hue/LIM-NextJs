export type SitePageField =
  | {
      type: "text";
      key: string;
      label: string;
      placeholder?: string;
      hint?: string;
    }
  | {
      type: "textarea";
      key: string;
      label: string;
      placeholder?: string;
      rows?: number;
      hint?: string;
    }
  | {
      type: "list-simple";
      key: string;
      label: string;
      itemLabel: string;
      addLabel?: string;
    }
  | {
      type: "list-pair";
      key: string;
      label: string;
      titleLabel: string;
      descLabel: string;
      addLabel?: string;
    };

export type SitePageArea = "beranda" | "profil" | "layanan";

export interface SitePageDefinition {
  key: string;
  route: string;
  title: string;
  description: string;
  area: SitePageArea;
  fields: SitePageField[];
  defaults: Record<string, unknown>;
}

export const SITE_PAGES: Record<string, SitePageDefinition> = {
  "homepage.about": {
    key: "homepage.about",
    route: "/#tentang",
    title: "Tentang (Beranda)",
    description:
      "Section Tentang Kami pada halaman utama: judul, deskripsi, gambar, dan kartu fitur.",
    area: "beranda",
    fields: [
      { type: "text", key: "badge", label: "Badge label" },
      { type: "text", key: "title", label: "Judul section" },
      { type: "text", key: "subtitle", label: "Subtitle" },
      {
        type: "textarea",
        key: "description",
        label: "Deskripsi",
        rows: 6,
      },
      { type: "text", key: "image", label: "Path gambar" },
      {
        type: "list-pair",
        key: "features",
        label: "Kartu fitur",
        titleLabel: "Nama fitur",
        descLabel: "Deskripsi",
        addLabel: "Tambah fitur",
      },
    ],
    defaults: {
      badge: "Tentang Kami",
      title: "Lembaga Ittihadul Muballighin",
      subtitle:
        "Membangun generasi muballigh yang berilmu, berakhlak, dan berkontribusi bagi umat.",
      description:
        "Lembaga Ittihadul Muballighin merupakan organisasi yang bergerak dalam bidang dakwah, pendidikan, pembinaan muballigh, serta pengabdian kepada masyarakat. Kami berkomitmen untuk menghadirkan dakwah yang moderat, mencerahkan, dan memberikan manfaat nyata bagi umat.",
      image: "/images/iksadari.jpg",
      features: [
        {
          title: "Dakwah",
          description: "Menebarkan syiar Islam melalui berbagai kegiatan dakwah.",
        },
        {
          title: "Pendidikan",
          description: "Menyelenggarakan pelatihan dan pembinaan muballigh.",
        },
        {
          title: "Sosial",
          description: "Aktif dalam kegiatan sosial dan pemberdayaan masyarakat.",
        },
        {
          title: "Pembinaan",
          description: "Membentuk muballigh yang amanah dan profesional.",
        },
      ],
    },
  },

  "page:profil": {
    key: "page:profil",
    route: "/profil",
    title: "Profil",
    description:
      "Halaman ringkasan profil: pernyataan visi dan butir-butir misi organisasi.",
    area: "profil",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "textarea",
        key: "visi",
        label: "Visi",
        rows: 4,
      },
      {
        type: "list-simple",
        key: "misi",
        label: "Butir misi",
        itemLabel: "Misi",
        addLabel: "Tambah misi",
      },
    ],
    defaults: {
      headerTitle: "Lembaga Ittihadul Muballighin",
      headerDescription:
        "Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat.",
      visi: "Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh berkualitas, profesional, dan berakhlakul karimah di seluruh Indonesia.",
      misi: [
        "Menyelenggarakan pendidikan dan pelatihan muballigh",
        "Memperkuat jaringan dakwah di seluruh Nusantara",
        "Mengembangkan program pemberdayaan masyarakat",
        "Menjalin kerja sama dengan lembaga dakwah lainnya",
      ],
    },
  },

  "page:tentang": {
    key: "page:tentang",
    route: "/profil/tentang",
    title: "Tentang LIM",
    description:
      "Halaman profil mendalam: sejarah, keunggulan, dan tujuan organisasi.",
    area: "profil",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "textarea",
        key: "sejarah",
        label: "Sejarah",
        rows: 8,
        hint: "Pisahkan paragraf dengan baris kosong.",
      },
      {
        type: "list-pair",
        key: "keunggulan",
        label: "Keunggulan",
        titleLabel: "Nama keunggulan",
        descLabel: "Deskripsi",
        addLabel: "Tambah keunggulan",
      },
      {
        type: "list-simple",
        key: "tujuan",
        label: "Tujuan",
        itemLabel: "Tujuan",
        addLabel: "Tambah tujuan",
      },
    ],
    defaults: {
      headerTitle: "Tentang LIM",
      headerDescription:
        "Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat.",
      sejarah:
        "Lembaga Ittihadul Muballighin (LIM) didirikan dengan visi untuk membangun jaringan dakwah yang kuat dan terorganisir di seluruh Indonesia. LIM hadir sebagai wadah bagi para muballigh untuk berkoordinasi, berkolaborasi, dan mengembangkan kemampuan dakwah secara profesional.\n\nSejak berdirinya, LIM telah tumbuh menjadi organisasi yang dikenal luas oleh masyarakat Muslim di Indonesia. LIM terus berupaya untuk memperkuat peran muballigh dalam pembangunan peradaban umat melalui berbagai program dan kegiatan yang terencana.",
      keunggulan: [
        {
          title: "Jaringan Luas",
          description:
            "Terhubung dengan muballigh di seluruh provinsi di Indonesia dengan struktur organisasi yang terorganisir.",
        },
        {
          title: "Profesional",
          description:
            "Mengembangkan muballigh yang profesional, terlatih, dan berakhlakul karimah.",
        },
        {
          title: "Program Terencana",
          description:
            "Menyelenggarakan program-program dakwah yang terencana, terukur, dan berkelanjutan.",
        },
        {
          title: "Kolaboratif",
          description:
            "Menjalin kerja sama dengan berbagai lembaga dakwah dan organisasi keagamaan lainnya.",
        },
      ],
      tujuan: [
        "Memperkuat jaringan dakwah di seluruh Indonesia.",
        "Mengembangkan muballigh yang profesional dan terlatih.",
        "Menyelenggarakan program pendidikan dan pelatihan.",
        "Membangun kerja sama dengan lembaga dakwah lainnya.",
        "Mengembangkan program pemberdayaan masyarakat.",
      ],
    },
  },

  "page:visi-misi": {
    key: "page:visi-misi",
    route: "/profil/visi-misi",
    title: "Visi & Misi",
    description:
      "Halaman arah organisasi: pernyataan visi dan enam poin misi bernomor.",
    area: "profil",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "textarea",
        key: "visi",
        label: "Pernyataan visi",
        rows: 5,
      },
      {
        type: "list-pair",
        key: "misi",
        label: "Poin misi",
        titleLabel: "Judul misi",
        descLabel: "Penjelasan",
        addLabel: "Tambah misi",
      },
    ],
    defaults: {
      headerTitle: "Visi & Misi",
      headerDescription:
        "Arah dan tujuan Lembaga Ittihadul Muballighin dalam membangun peradaban umat.",
      visi: "Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh berkualitas, profesional, dan berakhlakul karimah di seluruh Indonesia, serta berkontribusi nyata dalam pembangunan peradaban umat.",
      misi: [
        {
          title: "Pendidikan & Pelatihan",
          description:
            "Menyelenggarakan pendidikan dan pelatihan muballigh secara berkala dan terstruktur.",
        },
        {
          title: "Jaringan Dakwah",
          description:
            "Memperkuat jaringan dakwah di seluruh Nusantara melalui koordinasi antar daerah.",
        },
        {
          title: "Pemberdayaan Masyarakat",
          description:
            "Mengembangkan program pemberdayaan masyarakat yang berdampak langsung.",
        },
        {
          title: "Kerja Sama",
          description:
            "Menjalin kerja sama dengan lembaga dakwah dan organisasi keagamaan lainnya.",
        },
        {
          title: "Dakwah Digital",
          description:
            "Memanfaatkan teknologi digital untuk memperluas jangkauan dakwah.",
        },
        {
          title: "Kaderisasi",
          description:
            "Membina kader muballigh muda yang kompeten dan bersemangat.",
        },
      ],
    },
  },

  "page:falak": {
    key: "page:falak",
    route: "/falak",
    title: "Layanan Falak",
    description:
      "Halaman pengantar layanan falak: deskripsi dan metode perhitungan.",
    area: "layanan",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "textarea",
        key: "metode",
        label: "Metode perhitungan",
        rows: 6,
        hint: "Teks pada kotak 'Metode Perhitungan' di bawah kartu alat.",
      },
    ],
    defaults: {
      headerTitle: "Layanan Falak",
      headerDescription:
        "Ilmu falak yang hidup: jadwal shalat, arah kiblat, dan kalender Hijriah — dihitung mengikuti kaidah hisab yang dipakai para muwaqqit pesantren.",
      metode:
        "Seluruh layanan falak LIM mengikuti kaidah hisab yang digunakan Kementerian Agama RI dan tradisi muwaqqit pesantren: perhitungan posisi Matahari dan Bulan berdasarkan koordinat lokasi, dengan penambahan waktu ihtiyat sebesar 3 menit sebagai bentuk kehati-hatian dalam beribadah.",
    },
  },

  "page:kontak": {
    key: "page:kontak",
    route: "/kontak",
    title: "Hubungi Kami",
    description:
      "Informasi kontak sekretariat: alamat, telepon, email, dan nomor WhatsApp.",
    area: "layanan",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "textarea",
        key: "address",
        label: "Alamat",
        rows: 3,
        hint: "Baris baru akan ditampilkan sebagai baris terpisah.",
      },
      {
        type: "text",
        key: "phone",
        label: "Telepon",
      },
      {
        type: "text",
        key: "email",
        label: "Email",
      },
      {
        type: "text",
        key: "whatsapp",
        label: "Nomor WhatsApp",
        placeholder: "628xxxxxxxxxx (tanpa +)",
        hint: "Dipakai tombol 'Kirim via WhatsApp'.",
      },
    ],
    defaults: {
      headerTitle: "Hubungi Kami",
      headerDescription:
        "Silakan hubungi kami untuk informasi lebih lanjut.",
      address: "Gedung Al Ittihad Lt.1\nPondok Pesantren Lirboyo, Kediri",
      phone: "+62 813-6789-1910",
      email: "info@ittihadulmuballighin.or.id",
      whatsapp: "6281367891910",
    },
  },

  "page:tim-wajib-khidmah": {
    key: "page:tim-wajib-khidmah",
    route: "/profil/bidang/tim-wajib-khidmah",
    title: "Tim Wajib Khidmah",
    description:
      "Halaman penugasan anggota LIM: peran dan tugas selama masa khidmah.",
    area: "profil",
    fields: [
      {
        type: "text",
        key: "headerTitle",
        label: "Judul halaman",
      },
      {
        type: "textarea",
        key: "headerDescription",
        label: "Deskripsi halaman",
        rows: 3,
      },
      {
        type: "text",
        key: "sectionTitle",
        label: "Judul section",
      },
      {
        type: "textarea",
        key: "description",
        label: "Deskripsi section",
        rows: 4,
      },
      {
        type: "list-simple",
        key: "peran",
        label: "Peran dan tugas",
        itemLabel: "Tugas",
        addLabel: "Tambah tugas",
      },
      {
        type: "textarea",
        key: "memberNote",
        label: "Catatan anggota",
        rows: 3,
      },
    ],
    defaults: {
      headerTitle: "Tim Wajib Khidmah",
      headerDescription:
        "Penugasan anggota LIM untuk melayani kegiatan dan kebutuhan organisasi selama masa khidmah.",
      sectionTitle: "Peran dan Tugas",
      description:
        "Setiap muballigh yang ditugaskan menjalankan peran berikut selama masa pengabdiannya.",
      peran: [
        "Menjadi panitia maupun petugas dalam kegiatan organisasi.",
        "Melaksanakan penugasan rutin yang ditetapkan oleh pengurus.",
        "Mendukung pelayanan di tempat-tempat kegiatan sesuai pos Wajib Khidmah yang ditugaskan.",
        "Menjaga amanah, kedisiplinan, dan ketertiban selama masa khidmah.",
      ],
      memberNote:
        "Daftar anggota Wajib Khidmah bersifat internal dan dikelola melalui sistem administratif organisasi. Informasi terkait penugasan dapat dikonfirmasi langsung kepada pengurus.",
    },
  },
};

export const SITE_PAGE_KEYS = Object.keys(SITE_PAGES);

export function getSitePageDefinition(key: string): SitePageDefinition | null {
  return SITE_PAGES[key] ?? null;
}

export const SITE_PAGE_AREAS: Record<
  SitePageArea,
  { label: string; description: string }
> = {
  beranda: {
    label: "Beranda",
    description: "Section utama pada halaman muka.",
  },
  profil: {
    label: "Profil",
    description: "Halaman pengenalan dan informasi lembaga.",
  },
  layanan: {
    label: "Layanan",
    description: "Halaman layanan dan kontak.",
  },
};
