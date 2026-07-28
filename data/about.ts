import {
  BookOpen,
  Handshake,
  Landmark,
  Users,
  LucideIcon,
} from "lucide-react";


export interface AboutFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface AboutData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: AboutFeature[];
}

export const aboutData: AboutData = {
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
      icon: Landmark,
    },
    {
      title: "Pendidikan",
      description: "Menyelenggarakan pelatihan dan pembinaan muballigh.",
      icon: BookOpen,
    },
    {
      title: "Sosial",
      description: "Aktif dalam kegiatan sosial dan pemberdayaan masyarakat.",
      icon: Handshake,
    },
    {
      title: "Pembinaan",
      description: "Membentuk muballigh yang amanah dan profesional.",
      icon: Users,
    },
  ],
};
