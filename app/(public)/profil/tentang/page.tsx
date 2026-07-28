import SectionHeading from "@/components/shared/section-heading";

export default function TentangPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Tentang"
          title="Tentang LIM"
          description="Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat."
        />

        <div className="mt-12 space-y-8">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-card-foreground">Sejarah</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Lembaga Ittihadul Muballighin (LIM) didirikan dengan visi untuk
              membangun jaringan dakwah yang kuat dan terorganisir di seluruh
              Indonesia. LIM hadir sebagai wadah bagi para muballigh untuk
              berkoordinasi, berkolaborasi, dan mengembangkan kemampuan dakwah
              secara profesional.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Sejak berdirinya, LIM telah tumbuh menjadi organisasi yang
              dikenal luas oleh masyarakat Muslim di Indonesia. LIM terus
              berupaya untuk memperkuat peran muballigh dalam pembangunan
              peradaban umat melalui berbagai program dan kegiatan yang
              terencana.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-card-foreground">
              Keunggulan
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-card-foreground">
                  Jaringan Luas
                </h4>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Terhubung dengan muballigh di seluruh provinsi di Indonesia
                  dengan struktur organisasi yang terorganisir.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-card-foreground">
                  Profesional
                </h4>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Mengembangkan muballigh yang profesional, terlatih, dan
                  berakhlakul karimah.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-card-foreground">
                  Program Terencana
                </h4>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Menyelenggarakan program-program dakwah yang terencana,
                  terukur, dan berkelanjutan.
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-semibold text-card-foreground">
                  Kolaboratif
                </h4>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Menjalin kerja sama dengan berbagai lembaga dakwah dan
                  organisasi keagamaan lainnya.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-card-foreground">Tujuan</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Memperkuat jaringan dakwah di seluruh Indonesia.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Mengembangkan muballigh yang profesional dan terlatih.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Menyelenggarakan program pendidikan dan pelatihan.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Membangun kerja sama dengan lembaga dakwah lainnya.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                Mengembangkan program pemberdayaan masyarakat.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
