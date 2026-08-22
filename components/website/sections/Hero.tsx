import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import FolioSection from "@/components/website/taqwim/folio-section";
import { TaqwimFolio } from "@/components/website/taqwim/taqwim-folio";
import StatRule from "@/components/website/taqwim/stat-rule";
import { Button } from "@/components/ui/button";
import RouteMap from "@/components/website/sections/route-map";
import type { HeroConfig } from "@/types/hero";

import { HeroCanvas } from "./hero-canvas";

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative">
      <HeroCanvas />

      <FolioSection
        arabic="الفجر"
        label="Subuh — awal hari di Lirboyo"
        contentClassName="pt-1 pb-14 sm:pb-16 lg:pt-4 lg:pb-20"
      >
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <div>
            <h1 className="max-w-2xl font-display text-[2.4rem] font-medium leading-[1.06] text-foreground sm:text-5xl lg:text-[3.4rem]">
              {hero.title}
            </h1>

            {hero.highlight && (
              <p className="mt-4 font-display text-xl font-medium italic text-primary sm:text-2xl">
                {hero.highlight}
              </p>
            )}

            <p className="mt-5 max-w-xl text-sm leading-7 text-pretty text-muted-foreground sm:text-base">
              {hero.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="default" size="lg" asChild>
                <Link href={hero.ctaHref}>
                  {hero.ctaLabel}
                  <ArrowRight size={16} data-icon="inline-end" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary hover:text-primary"
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

          <div className="relative lg:justify-self-end">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 z-0 rounded-[3rem] bg-primary/5"
            />
            <div className="relative z-10">
              <TaqwimFolio />
            </div>
          </div>
        </div>
      </FolioSection>

      <RouteMap />
    </section>
  );
}
