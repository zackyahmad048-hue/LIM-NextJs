import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { TaqwimFolio } from "@/components/website/taqwim/taqwim-folio";
import StatRule from "@/components/website/taqwim/stat-rule";
import Reveal from "@/components/website/motion/reveal";
import SectionLabel from "@/components/shared/section-label";
import { Button } from "@/components/ui/button";
import RouteMap from "@/components/website/sections/route-map";
import HeroBackdrop from "@/components/website/sections/hero-backdrop";
import type { HeroConfig } from "@/types/hero";

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative">
      <HeroBackdrop />

      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6 sm:pb-16 lg:pt-16 lg:pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <Reveal>
            <div>
              <SectionLabel>Lembaga Ittihadul Muballighin</SectionLabel>

              <h1 className="mt-4 max-w-2xl font-display text-[2.75rem] font-medium leading-[1.05] tracking-[-0.02em] text-balance text-foreground sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>

              {hero.highlight && (
                <p className="mt-5 font-display text-xl font-medium italic text-primary sm:text-2xl">
                  {hero.highlight}
                </p>
              )}

              <p className="mt-6 max-w-xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8">
                {hero.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-7 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
                  asChild
                >
                  <Link href={hero.ctaHref}>
                    {hero.ctaLabel}
                    <ArrowRight size={16} data-icon="inline-end" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border px-7 text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-secondary hover:text-primary"
                  asChild
                >
                  <Link href={hero.secondaryHref}>
                    <BookOpen size={16} data-icon="inline-start" />
                    {hero.secondaryLabel}
                  </Link>
                </Button>
              </div>

              {hero.statCards && hero.statCards.length > 0 && (
                <div className="mt-10">
                  <StatRule items={hero.statCards} className="max-w-md" />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative lg:justify-self-end">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 z-0 rounded-[3rem] bg-primary/5"
            />
            <div className="relative z-10">
              <TaqwimFolio />
            </div>
          </Reveal>
        </div>
      </div>

      <RouteMap />
    </section>
  );
}
