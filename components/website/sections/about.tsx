"use client"

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from "@/modules/shared/utils/motion";
import SectionHeading from "@/components/shared/section-heading";
import AboutCard from "@/components/website/cards/about-card";
import { Button } from "@/components/ui/button";
import { aboutData } from "@/data/about";

export default function About() {
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
          badge={aboutData.badge}
          title={aboutData.title}
          description={aboutData.subtitle}
        />

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-2xl shadow-lg lg:aspect-[4/5]">
              <Image
                src={aboutData.image}
                alt={aboutData.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-xl font-bold text-foreground">
              Siapa Kami?
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {aboutData.description}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-5 grid gap-3 sm:grid-cols-2"
            >
              {aboutData.features.map((feature) => (
                <AboutCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-5">
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
