"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { BIDANG } from "@/config/bidang";
import Reveal from "@/components/website/motion/reveal";

function BidangCard({
  slug,
  title,
  tagline,
}: {
  slug: string;
  title: string;
  tagline: string;
}) {
  return (
    <Link
      href={`/profil/bidang/${slug}`}
      className="flex h-full flex-col rounded-xl border border-primary/25 bg-card p-5 shadow-sm"
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/40"
        aria-hidden
      >
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </span>

      <h3 className="mt-4 font-heading text-base font-base text-balance text-foreground">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-pretty text-muted-foreground">
        {tagline}
      </p>
    </Link>
  );
}

export default function BidangCarousel() {
  const reduced = useReducedMotion();

  const items = BIDANG.map((b) => (
    <div
      key={b.slug}
      className="w-[18rem] shrink-0 sm:w-[20rem] md:w-[22rem]"
    >
      <BidangCard slug={b.slug} title={b.title} tagline={b.tagline} />
    </div>
  ));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <Reveal from="scale">
        <div
          className="group/marquee relative overflow-hidden"
          onMouseEnter={(e) => {
            const inner = e.currentTarget.querySelector(
              "[data-marquee-inner]",
            ) as HTMLElement;
            if (inner) inner.style.animationPlayState = "paused";
          }}
          onMouseLeave={(e) => {
            const inner = e.currentTarget.querySelector(
              "[data-marquee-inner]",
            ) as HTMLElement;
            if (inner) inner.style.animationPlayState = "running";
          }}
        >
          {/* Gradient fades on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent" />

          <div
            data-marquee-inner
            className="flex w-max gap-6"
            style={
              reduced
                ? undefined
                : {
                    animation: "marquee-seamless 60s linear infinite",
                  }
            }
          >
            {items}
            {items}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
