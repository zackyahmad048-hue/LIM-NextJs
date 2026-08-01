"use client";

import dynamic from "next/dynamic";
import type { HeroConfig } from "@/types/hero";
import { Skeleton } from "@/components/ui/skeleton";

type HeroProps = { hero: HeroConfig };

const Hero = dynamic<HeroProps>(
  () => import("@/components/website/sections/Hero").then((m) => m.default),
  {
    ssr: false,
    loading: () => <HeroSkeleton />,
  }
);

function HeroSkeleton() {
  return (
    <div className="h-155 sm:h-145 lg:h-162.5 bg-slate-950">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-4 px-4 sm:px-6">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-3 h-12 w-3/4" />
        <Skeleton className="mt-2 h-8 w-1/2" />
        <Skeleton className="mt-4 h-16 w-2/3" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 w-36 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function HeroClient({ hero }: { hero: HeroConfig }) {
  return <Hero hero={hero} />;
}
