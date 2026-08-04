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
import { FaThreads, FaXTwitter } from "react-icons/fa6";

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
    label: "X",
    href: "#",
    icon: FaXTwitter,
  },
  {
    label: "Threads",
    href: "https://www.threads.com/@limproduction",
    icon: FaThreads,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-primary-foreground">

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-12">
          <div>
            <p className="text-xl font-semibold tracking-wide">
              Lembaga Ittihadul Muballighin
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
              Menebar Cahaya
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground">
                Tentang Kami
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80">
                Lembaga dakwah, pendidikan, pembinaan muballigh, dan pengabdian
                masyarakat dari Pondok Pesantren Lirboyo, Kediri.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground">
                Menu
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
                {menuLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition hover:text-primary-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground">
                Falak
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
                {falakLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition hover:text-primary-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground">
                Hubungi Kami
              </h3>
              <div className="mt-4 space-y-3 text-sm text-primary-foreground/80">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" />
                  <p className="leading-6">
                    Gedung al Ittihad 1 Lt.1
                    <br />
                    Pondok Pesantren Lirboyo
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">
                    info@ittihadulmuballighin.or.id
                  </span>
                </div>

                <Link
                  href="https://wa.me/6281367891910"
                  target="_blank"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-primary-foreground px-4 text-xs font-semibold text-primary transition hover:bg-primary-foreground/90"
                >
                  <FaWhatsapp className="h-3.5 w-3.5" />
                  WhatsApp
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-center text-xs text-primary-foreground/70 sm:text-left">
                © 2026 Sekretariat Lembaga Ittihadul Muballighin
              </p>

              <div className="flex flex-wrap justify-center gap-2.5">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
