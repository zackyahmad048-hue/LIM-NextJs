import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/website/motion/reveal";
import StatRule from "@/components/website/taqwim/stat-rule";
import { PrayerScheduleWidget } from "@/components/website/falak/prayer-schedule-widget";
import { Button } from "@/components/ui/button";
import type { HeroConfig } from "@/types/hero";

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.16] dark:opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/85 to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:pb-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-10">
          <div className="text-left">
            <h1 className="max-w-3xl font-heading text-[2.75rem] font-bold leading-[1.02] tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
              {hero.highlight && (
                <span className="block text-primary">
                  {hero.highlight}
                </span>
              )}
              {hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="rounded-xl px-7 font-semibold uppercase tracking-wide"
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
                className="rounded-xl border-border px-7 font-semibold uppercase tracking-wide text-foreground transition-colors duration-300 ease-out hover:border-primary hover:text-primary"
                asChild
              >
                <Link href={hero.secondaryHref}>{hero.secondaryLabel}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Reserve the column height on desktop so the floating widget
                never drives the hero height / causes layout shift. */}
            <div aria-hidden className="hidden lg:block lg:h-136" />

            <Reveal
              from="scale"
              startScale={0.85}
              delay={0.2}
              className="lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center"
            >
              <div className="w-full max-w-[18rem] sm:max-w-[20rem] lg:max-w-88">
                <PrayerScheduleWidget />
              </div>
            </Reveal>
          </div>
        </div>

        {hero.statCards && hero.statCards.length > 0 && (
          <Reveal delay={0.3} className="mt-14 w-full">
            <StatRule
              items={hero.statCards}
              className="glass rounded-xl border border-primary/25 shadow-sm"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}