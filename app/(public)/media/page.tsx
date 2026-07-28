import SectionHeading from "@/components/shared/section-heading";

export default function MediaPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Media"
          title="Galeri & Dokumentasi"
          description="Dokumentasi kegiatan, foto, dan video Lembaga Ittihadul Muballighin."
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-muted transition hover:opacity-80"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
