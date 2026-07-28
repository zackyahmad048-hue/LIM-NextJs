import { Suspense } from "react";
import HeroClient from "@/components/website/sections/hero-client";
import About from "@/components/website/sections/about";
import { getHeroConfig } from "@/modules/cms/queries/hero.query";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 3600;

export default async function Home() {
  const heroConfig = await getHeroConfig();

  return (
    <>
      <HeroClient hero={heroConfig} />
      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-none" />}>
        <About />
      </Suspense>
    </>
  );
}
