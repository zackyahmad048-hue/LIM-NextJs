import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import { HubDot } from "@/components/shared/hub-dot";

export const metadata: Metadata = {
  title: "Tentang LIM | LIM Digital Platform",
  description:
    "Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah.",
};

export default function TentangPage() {
  return (
    <>
      <PageHeader
        title="Tentang LIM"
        description="Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Sejarah
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Lembaga Ittihadul Muballighin (LIM) didirikan dengan visi untuk
              membangun jaringan dakwah yang kuat dan terorganisir di seluruh
              Indonesia. LIM hadir sebagai wadah bagi para muballigh untuk
              berkoordinasi, berkolaborasi, dan mengembangkan kemampuan dakwah
              secara profesional.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Sejak berdirinya, LIM telah tumbuh menjadi organisasi yang dikenal
              luas oleh masyarakat Muslim di Indonesia. LIM terus berupaya untuk
              memperkuat peran muballigh dalam pembangunan peradaban umat
              melalui berbagai program dan kegiatan yang terencana.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Keunggulan
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Jaringan Luas",
                  desc: "Terhubung dengan muballigh di seluruh provinsi di Indonesia dengan struktur organisasi yang terorganisir.",
                },
                {
                  title: "Profesional",
                  desc: "Mengembangkan muballigh yang profesional, terlatih, dan berakhlakul karimah.",
                },
                {
                  title: "Program Terencana",
                  desc: "Menyelenggarakan program-program dakwah yang terencana, terukur, dan berkelanjutan.",
                },
                {
                  title: "Kolaboratif",
                  desc: "Menjalin kerja sama dengan berbagai lembaga dakwah dan organisasi keagamaan lainnya.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl bg-muted/50 p-5">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Tujuan
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              {[
                "Memperkuat jaringan dakwah di seluruh Indonesia.",
                "Mengembangkan muballigh yang profesional dan terlatih.",
                "Menyelenggarakan program pendidikan dan pelatihan.",
                "Membangun kerja sama dengan lembaga dakwah lainnya.",
                "Mengembangkan program pemberdayaan masyarakat.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <HubDot className="mt-1.5 h-2.5 w-2.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
