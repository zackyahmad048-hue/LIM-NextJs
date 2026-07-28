import SectionHeading from "@/components/shared/section-heading";

export default function ArtikelPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Artikel"
          title="Artikel & Kajian"
          description="Artikel keislaman, kajian, dan tulisan inspiratif dari para muballigh."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-card p-4 transition hover:shadow-md"
            >
              <div className="h-20 w-20 shrink-0 rounded-lg bg-muted" />
              <div>
                <div className="text-xs text-muted-foreground">
                  18 Juli 2026
                </div>
                <h3 className="mt-1 text-sm font-bold text-card-foreground">
                  Judul Artikel {i}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Ringkasan singkat artikel.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
