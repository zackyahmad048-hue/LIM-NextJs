"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { TextReveal } from "@/components/motion/text-reveal";
import { Button } from "@/components/ui/button";
import type { HeroConfig } from "@/types/hero";
import { EASE_OUT } from "@/lib/ease";

export default function Hero({ hero }: { hero: HeroConfig }) {
  return (
    <section className="relative h-155 overflow-hidden sm:h-145 lg:h-[650px]">
      <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjcwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-950 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          >
            <div className="inline-flex h-6 items-center rounded-full border border-white/15 bg-white/10 px-3 text-[11px] font-medium text-primary backdrop-blur-sm">
              {hero.eyebrow}
            </div>
          </motion.div>

          <TextReveal
            text={hero.title}
            as="h1"
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            stagger={0.06}
            delay={0.3}
          />

          {hero.highlight && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
              className="mt-3 text-lg font-semibold text-primary sm:text-xl"
            >
              {hero.highlight}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE_OUT }}
            className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: EASE_OUT }}
            className="mt-6 flex flex-wrap gap-3"
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
              className="border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href={hero.secondaryHref}>
                <BookOpen size={16} data-icon="inline-start" />
                {hero.secondaryLabel}
              </Link>
            </Button>
          </motion.div>
        </div>

        {hero.statCards && hero.statCards.length > 0 && (
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {hero.statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.3 + i * 0.15,
                  ease: EASE_OUT,
                }}
                className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md will-change-transform"
              >
                <p className="text-xl font-bold text-primary">{card.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                  {card.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
