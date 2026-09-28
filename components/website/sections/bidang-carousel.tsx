"use client";

import Link from "next/link";
import {
  type LucideIcon,
  UsersRound,
  MoonStar,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  MonitorSmartphone,
  School,
  HandCoins,
  Sparkles,
} from "lucide-react";
import { BIDANG } from "@/config/bidang";
import Reveal from "@/components/website/motion/reveal";
import SiteSection from "@/components/website/layout/site-section";

const BIDANG_ICONS: Record<string, LucideIcon> = {
  "tim-wajib-khidmah": UsersRound,
  "safari-ramadan": MoonStar,
  "safari-dakwah-rutinan": CalendarDays,
  "penelitian-pengembangan": FlaskConical,
  "pesantren-ramadan": GraduationCap,
  "dakwah-digital": MonitorSmartphone,
  "pendidikan-kaderisasi": School,
  "pemberdayaan-ekonomi": HandCoins,
};

function BidangItem({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const Icon = BIDANG_ICONS[slug] ?? Sparkles;

  return (
    <Link
      href={`/profil/bidang/${slug}`}
      className="group flex shrink-0 flex-col items-center gap-3 text-center"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 transition-colors duration-300 ease-out group-hover:border-primary group-hover:bg-primary/5 motion-reduce:transition-none"
        aria-hidden
      >
        <Icon className="h-5 w-5 text-primary" />
      </span>

      <span className="font-heading text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 ease-out">
        {title}
      </span>
    </Link>
  );
}

export default function BidangCarousel() {
  const doubled = [...BIDANG, ...BIDANG];

  return (
    <SiteSection as="div">
      <Reveal from="left">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-medium text-foreground">
            Bidang Kegiatan
          </h2>
          <p className="mt-1.5 max-w-lg text-sm leading-6 text-pretty text-muted-foreground">
            Delapan bidang kegiatan organisasi yang menjalankan program dakwah LIM.
          </p>
        </div>
      </Reveal>

      <Reveal from="scale">
        <div className="overflow-hidden">
          <div className="flex w-max gap-8 animate-marquee motion-reduce:animate-none">
            {doubled.map((b, i) => (
              <BidangItem key={`${b.slug}-${i}`} slug={b.slug} title={b.title} />
            ))}
          </div>
        </div>
      </Reveal>
    </SiteSection>
  );
}
