import SectionHeading from "@/components/shared/section-heading";

export default function VisiMisiPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Profil"
          title="Visi & Misi"
          description="Arah dan tujuan Lembaga Ittihadul Muballighin dalam membangun peradaban umat."
        />

        <div className="mt-12 space-y-8">
          <div className="rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Visi</h3>
            </div>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">
              Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh
              berkualitas, profesional, dan berakhlakul karimah di seluruh
              Indonesia, serta berkontribusi nyata dalam pembangunan peradaban
              umat.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground">Misi</h3>
            </div>
            <ul className="mt-5 space-y-4">
              {[
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
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-xs font-bold text-sky-600 dark:text-sky-400">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground">
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
      </div>
    </section>
  );
}
