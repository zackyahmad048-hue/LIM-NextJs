import { Button } from "@/components/ui/button";
import AboutCard from "@/components/website/cards/about-card";
import FolioSection from "@/components/website/taqwim/folio-section";
import Reveal from "@/components/website/motion/reveal";
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
    <FolioSection
      arabic="نبذة"
      label="Selayang Pandang"
      contentClassName="py-8 sm:py-10 lg:py-14"
    >
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-medium text-balance text-foreground md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-pretty text-muted-foreground md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </Reveal>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <Reveal from="left" className="relative">
          <div className="relative mx-auto max-w-md">
            <div
              className="absolute -inset-3 border border-border bg-muted/40"
              aria-hidden
            />
            <div className="relative aspect-4/3 overflow-hidden lg:aspect-4/5">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal from="right">
          <h3 className="font-display text-2xl font-medium text-balance text-primary">
            Siapa Kami?
          </h3>

          <p className="mt-4 text-sm leading-7 text-pretty text-muted-foreground">
            {description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
            <Button variant="default" size="sm" asChild>
              <Link href="/profil">
                Selengkapnya
                <ArrowRight size={18} data-icon="inline-end" />
              </Link>
            </Button>
          </Reveal>
        </Reveal>
      </div>
    </FolioSection>
  );
}
