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
  },
);

function HeroSkeleton() {
  return (
    <div className="bg-background">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div className="flex flex-col justify-center gap-4">
          <Skeleton className="h-12 w-3/4 rounded-md" />
          <Skeleton className="mt-2 h-6 w-1/2 rounded-md" />
          <Skeleton className="h-6 w-2/3 rounded-md" />
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          <div className="mt-8 max-w-md">
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
        </div>
        <div className="hidden lg:block">
          <Skeleton className="h-80 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function HeroClient({ hero }: { hero: HeroConfig }) {
  return <Hero hero={hero} />;
}