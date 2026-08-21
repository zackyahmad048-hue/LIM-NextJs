import { Suspense } from "react";
import type { Metadata } from "next";
import HeroClient from "@/components/website/sections/hero-client";
import About from "@/components/website/sections/about";
import PostGrid from "@/components/website/sections/post-grid";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";
import { getAboutContent } from "@/modules/cms/queries/site-page.query";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_GRIDS } from "@/config/home";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lembaga Ittihadul Muballighin - Pondok Pesantren Lirboyo Kota Kediri",
  description:
    "Platform manajemen organisasi dan dakwah Lembaga Ittihadul Muballighin — profil, artikel, dan media.",
};

export default async function Home() {
  const [heroConfig, about] = await Promise.all([
    getHeroConfig(),
    getAboutContent(),
  ]);

  return (
    <>
      <HeroClient hero={heroConfig} />
            {HOME_GRIDS.map((grid) => (
        <PostGrid key={grid.categorySlug} grid={grid} cardVariant="glass" />
      ))}
      <Suspense fallback={<Skeleton className="h-150 w-full rounded-none" />}>
        <About {...about} />
      </Suspense>
    </>
  );
}