"use client";

import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { BIDANG } from "@/config/bidang";
const menuLinks = [
  { title: "Beranda", href: "/" },
  { title: "Profil", href: "/profil" },
  { title: "Bidang", href: "/profil/bidang" },
  { title: "Artikel", href: "/artikel" },
  { title: "Kontak", href: "/kontak" },
];

const bidangLinks = BIDANG.map((bidang) => ({
  title: bidang.title,
  href: `/profil/bidang/${bidang.slug}`,
}));

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/limproduction/",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/limofficiallirboyo/?locale=id_ID",
    icon: FaFacebookF,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/c/LimProduction",
    icon: FaYoutube,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@limproduction",
    icon: FaTiktok,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@limproduction",
    icon: FaThreads,
  },
];

const linkClass =
  "transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/15 bg-primary/8 dark:bg-primary/12">
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">
            <div>
              <p className="font-heading text-2xl tracking-wide text-foreground">
                Lembaga Ittihadul Muballighin
              </p>
              <p className="mt-1.5 text-sm text-primary">
                Menebar Dakwah, Memasyarakatkan Pesantren
              </p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-pretty text-muted-foreground">
                Dakwah, pendidikan, dan pengabdian muballigh dari Pondok Pesantren
                Lirboyo, Kediri.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Jelajah
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                {menuLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Bidang
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
                {bidangLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Hubungi Kami
              </h3>
              <div className="mt-4 space-y-2.5 text-sm text-foreground/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="leading-6">
                    Gedung Al Ittihad Lt.1
                    <br />
                    Pondok Pesantren Lirboyo, Kediri
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="break-all">
                    info@ittihadulmuballighin.or.id
                  </span>
                </div>
              </div>

              <Link
                href="https://wa.me/6281367891910"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <FaWhatsapp className="h-4 w-4" />
                WhatsApp
              </Link>

              <div className="mt-3 flex items-center gap-0.5">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="mx-auto text-center text-xs text-muted-foreground">
              © 2026 Sekretariat Lembaga Ittihadul Muballighin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
