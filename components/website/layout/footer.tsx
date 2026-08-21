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
const menuLinks = [
  { title: "Beranda", href: "/" },
  { title: "Profil", href: "/profil" },
  { title: "Artikel", href: "/artikel" },
  { title: "Media", href: "/media" },
  { title: "Kontak", href: "/kontak" },
];

const falakLinks = [
  { title: "Layanan Falak", href: "/falak" },
  { title: "Jadwal Shalat", href: "/falak/jadwal-shalat" },
  { title: "Arah Kiblat", href: "/falak/kiblat" },
  { title: "Kalender Hijriah", href: "/falak/kalender-hijriah" },
];

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
  "transition hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground";

export default function Footer() {
  return (
    <footer className="relative bg-primary text-primary-foreground">
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">
            <div>
              <p className="font-display text-xl font-medium text-balance">
                Lembaga Ittihadul Muballighin
              </p>
              <p className="mt-1.5 font-display text-sm italic text-primary-foreground/90">
                Menebar Dakwah, Memasyarakatkan Pesantren
              </p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-pretty text-primary-foreground/80">
                Dakwah, pendidikan, dan pengabdian muballigh dari Pondok Pesantren
                Lirboyo, Kediri.
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-medium uppercase text-primary-foreground">
                Jelajah
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
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
              <h3 className="text-[10px] font-medium uppercase text-primary-foreground">
                Layanan Falak
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
                {falakLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-medium uppercase text-primary-foreground">
                Hubungi Kami
              </h3>
              <div className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" />
                  <p className="leading-6">
                    Gedung Al Ittihad Lt.1
                    <br />
                    Pondok Pesantren Lirboyo, Kediri
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">
                    info@ittihadulmuballighin.or.id
                  </span>
                </div>
              </div>

              <Link
                href="https://wa.me/6281367891910"
                target="_blank"
                className="mt-4 inline-flex h-11 items-center gap-2 bg-primary-foreground px-5 text-xs font-semibold text-primary transition hover:bg-primary-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
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
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center text-primary-foreground/80 transition hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/20 pt-6 sm:flex-row">
            <p className="text-center text-xs text-primary-foreground/70">
              © 2026 Sekretariat Lembaga Ittihadul Muballighin
            </p>
            <p className="font-data text-[10px] uppercase text-primary-foreground/60">
              Dicetak di Lirboyo · Kediri · Jawa Timur
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}