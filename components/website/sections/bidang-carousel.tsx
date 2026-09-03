"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BIDANG } from "@/config/bidang";

export default function BidangCarousel() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
        <CarouselContent className="-ml-3">
          {BIDANG.map((bidang) => (
            <CarouselItem
              key={bidang.slug}
              className="basis-[72%] pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link
                href={`/profil/bidang/${bidang.slug}`}
                className="group flex h-full flex-col rounded-xl border border-primary/25 bg-card p-5 shadow-sm transition-colors duration-300 ease-out hover:border-primary motion-reduce:transition-none"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-primary/40"
                  aria-hidden
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-125 motion-reduce:transition-none" />
                </span>

                <h3 className="mt-4 font-heading text-base font-base text-balance text-foreground">
                  {bidang.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-pretty text-muted-foreground">
                  {bidang.tagline}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center justify-center gap-2">
          <CarouselPrevious className="static translate-y-0 rounded-sm border border-border text-foreground hover:border-primary hover:text-primary" />
          <CarouselNext className="static translate-y-0 rounded-sm border border-border text-foreground hover:border-primary hover:text-primary" />
        </div>
      </Carousel>
    </section>
  );
}
