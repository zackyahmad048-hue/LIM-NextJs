import type { Metadata } from "next";
import { QiblaCompass } from "@/components/website/falak/qibla-compass";

export const metadata: Metadata = {
  title: "Arah Kiblat | Falak | LIM Digital Platform",
  description: "Temukan arah kiblat dari lokasi Anda.",
};

export default function KiblatPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Arah Kiblat</h1>
        <p className="mt-2 text-muted-foreground">
          Tentukan arah kiblat berdasarkan koordinat lokasi Anda.
        </p>
      </div>

      <QiblaCompass />
    </section>
  );
}
