import SectionHeading from "@/components/shared/section-heading";

export default function ProfilPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Profil"
          title="Lembaga Ittihadul Muballighin"
          description="Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah yang berkomitmen membangun peradaban umat."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-card-foreground">Visi</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Menjadi lembaga dakwah terdepan yang mampu membentuk muballigh
              berkualitas, profesional, dan berakhlakul karimah di seluruh
              Indonesia.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-card-foreground">Misi</h3>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
              <li>Menyelenggarakan pendidikan dan pelatihan muballigh</li>
              <li>Memperkuat jaringan dakwah di seluruh Nusantara</li>
              <li>Mengembangkan program pemberdayaan masyarakat</li>
              <li>Menjalin kerja sama dengan lembaga dakwah lainnya</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
