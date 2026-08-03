import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";

export const metadata: Metadata = {
  title: "Visi & Misi | LIM Digital Platform",
  description:
    "Arah dan tujuan Lembaga Ittihadul Muballighin dalam membangun peradaban umat.",
};

const misi = [
  {
    title: "Pendidikan & Pelatihan",
    desc: "Menyelenggarakan pendidikan dan pelatihan muballigh secara berkala dan terstruktur.",
  },
  {
    title: "Jaringan Dakwah",
    desc: "Memperkuat jaringan dakwah di seluruh Nusantara melalui koordinasi antar daerah.",
  },
  {
    title: "Pemberdayaan Masyarakat",
    desc: "Mengembangkan program pemberdayaan masyarakat yang berdampak langsung.",
  },
  {
    title: "Kerja Sama",
    desc: "Menjalin kerja sama dengan lembaga dakwah dan organisasi keagamaan lainnya.",
  },
  {
    title: "Dakwah Digital",
    desc: "Memanfaatkan teknologi digital untuk memperluas jangkauan dakwah.",
  },
  {
    title: "Kaderisasi",
    desc: "Membina kader muballigh muda yang kompeten dan bersemangat.",
  },
];

const roman = ["I", "II", "III", "IV", "V", "VI"];

export default function VisiMisiPage() {
  return (
    <>
      <PageHeader
        title="Visi & Misi"
        description="Arah dan tujuan Lembaga Ittihadul Muballighin dalam membangun peradaban umat."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Visi</SectionLabel>
            <p className="mt-5 font-display text-lg italic leading-8 text-foreground">
              Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh
              berkualitas, profesional, dan berakhlakul karimah di seluruh
              Indonesia, serta berkontribusi nyata dalam pembangunan peradaban
              umat.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Misi</SectionLabel>
            <ul className="mt-5 space-y-5">
              {misi.map((item, i) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 font-sans text-xs text-primary">
                    {roman[i]}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
