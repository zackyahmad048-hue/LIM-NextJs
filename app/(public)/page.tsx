import { Suspense } from "react";
import type { Metadata } from "next";
import HeroClient from "@/components/website/sections/hero-client";
import About from "@/components/website/sections/about";
import PostGrid from "@/components/website/sections/post-grid";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_GRIDS } from "@/config/home";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "LIM Digital Platform",
  description:
    "Platform manajemen organisasi dan dakwah Lembaga Ittihadul Muballighin — profil, artikel, media, dan layanan falak.",
};

export default async function Home() {
  const heroConfig = await getHeroConfig();

  return (
    <>
      <HeroClient hero={heroConfig} />
      <Suspense fallback={<Skeleton className="h-150 w-full rounded-none" />}>
        <About />
      </Suspense>
      {HOME_GRIDS.map((grid) => (
        <PostGrid key={grid.categorySlug} grid={grid} />
      ))}
    </>
  );
}
