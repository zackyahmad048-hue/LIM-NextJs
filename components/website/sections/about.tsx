import { Button } from "@/components/ui/button";
import AboutCard from "@/components/website/cards/about-card";
import Reveal from "@/components/website/motion/reveal";
import SectionLabel from "@/components/shared/section-label";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AboutFeature {
  title: string;
  description: string;
}

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: AboutFeature[];
}

export default function About({
  title,
  subtitle,
  description,
  image,
  features,
}: AboutSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Reveal>
        <div className="mx-auto max-w-5xl text-center lg:max-w-2xl">
          <SectionLabel>Selayang Pandang</SectionLabel>
          <h2 className="mt-4 font-heading text-2xl font-medium text-balance text-foreground md:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-pretty text-muted-foreground md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </Reveal>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
        <Reveal from="left" className="relative">
          <div className="relative mx-auto max-w-md">
            <div
              className="glass absolute -inset-3 border border-primary/20"
              aria-hidden
            />
            <div className="relative aspect-4/3 overflow-hidden lg:aspect-4/5">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal from="right">
          <h3 className="font-heading text-2xl font-medium text-balance text-primary">
            Siapa Kami?
          </h3>

          <p className="mt-4 text-sm leading-7 text-pretty text-muted-foreground">
            {description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal key={feature.title} index={i}>
                <AboutCard
                  title={feature.title}
                  description={feature.description}
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-6">
            <Button variant="default" size="lg" asChild>
              <Link href="/profil">
                Selengkapnya
                <ArrowRight size={18} data-icon="inline-end" />
              </Link>
            </Button>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
