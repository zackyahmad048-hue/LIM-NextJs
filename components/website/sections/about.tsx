"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerContainer,
} from "@/modules/shared/utils/motion";
import SectionHeading from "@/components/shared/section-heading";
import AboutCard from "@/components/website/cards/about-card";
import { Button } from "@/components/ui/button";

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
    <section className="py-10 sm:py-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl px-4 sm:px-6"
      >
        <SectionHeading
          title={title}
          description={subtitle}
        />

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-3 border border-border/10 bg-muted/60"
                aria-hidden
              />
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[4/5]">
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Siapa Kami?
            </h3>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {description}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-6 grid gap-3 sm:grid-cols-2"
            >
              {features.map((feature) => (
                <AboutCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <Button variant="default" size="sm" asChild>
                <Link href="/profil">
                  Pelajari Lebih Lanjut
                  <ArrowRight size={18} data-icon="inline-end" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}