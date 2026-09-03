import type { Metadata } from "next";
import Hero from "@/components/website/sections/Hero";
import About from "@/components/website/sections/about";
import BidangCarousel from "@/components/website/sections/bidang-carousel";
import ArticleBento from "@/components/website/sections/article-bento";
import SectionDivider from "@/components/website/layout/section-divider";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";
import { getAboutContent } from "@/modules/cms/queries/site-page.query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lembaga Ittihadul Muballighin - Pondok Pesantren Lirboyo Kota Kediri",
  description:
    "Platform manajemen organisasi dan dakwah Lembaga Ittihadul Muballighin: profil, artikel, dan media.",
};

export default async function Home() {
  const [heroConfig, about] = await Promise.all([
    getHeroConfig(),
    getAboutContent(),
  ]);

  return (
    <>
      <Hero hero={heroConfig} />
      <SectionDivider />
      <About {...about} />
      <SectionDivider />
      <BidangCarousel />
      <SectionDivider />
      <ArticleBento />
    </>
  );
}
