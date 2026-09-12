import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";
import { QiblaCompass } from "@/components/website/falak/qibla-compass";

export const metadata: Metadata = {
  title: "Arah Kiblat | Falak | LIM Digital Platform",
  description: "Temukan arah kiblat dari lokasi Anda.",
};

export default function KiblatPage() {
  return (
    <>
      <PageHeader
        title="Arah Kiblat"
        description="Tentukan arah kiblat berdasarkan koordinat lokasi Anda dengan kompas digital."
      />

      <SiteSection>
        <Reveal>
          <QiblaCompass />
        </Reveal>
      </SiteSection>
    </>
  );
}
