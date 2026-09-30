import type { Metadata } from "next";
import Hero from "@/components/website/sections/Hero";
import About from "@/components/website/sections/about";
import BidangCarousel from "@/components/website/sections/bidang-carousel";
import ArticleBento from "@/components/website/sections/article-bento";
import SectionDivider from "@/components/website/layout/section-divider";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";
import { getAboutContent } from "@/modules/cms/queries/site-page.query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </section>
      <About {...about} />
      <SectionDivider />
      <BidangCarousel />
      <SectionDivider />
      <ArticleBento />
    </>
  );
}
