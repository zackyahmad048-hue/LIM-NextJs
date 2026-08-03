"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import { SkyInstrument } from "@/components/website/sky/sky-instrument";
import RouteMap from "@/components/website/sections/route-map";
import type { HeroConfig } from "@/types/hero";
import { EASE_OUT } from "@/lib/ease";

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative">
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
        <div>
          <TextReveal
            text={hero.title}
            as="h1"
            className="font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            stagger={0.06}
            delay={0.15}
          />

          {hero.highlight && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
              className="mt-4 font-display text-lg font-medium italic text-primary sm:text-xl"
            >
              {hero.highlight}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: EASE_OUT }}
            className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: EASE_OUT }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
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
          </motion.div>

          {hero.statCards && hero.statCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE_OUT }}
              className="mt-10 max-w-md"
            >
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Capaian Dakwah
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {hero.statCards.map((card) => (
                    <li key={card.label}>
                      <span className="block text-2xl font-bold tabular-nums text-foreground">
                        {card.value}
                      </span>
                      <span className="mt-0.5 block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {card.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: EASE_OUT }}
          className="lg:justify-self-end"
        >
          <SkyInstrument />
        </motion.div>
      </div>

      <RouteMap />
    </section>
  );
}
