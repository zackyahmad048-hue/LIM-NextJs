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
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-start justify-between gap-8">
          <div>
            <p className="font-sans text-xl font-semibold tracking-wide">
              Lembaga Ittihadul Muballighin
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.32em] text-primary-foreground/70">
              Menebar Cahaya
            </p>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-primary-foreground/80 sm:block">
            Gedung al Ittihad 1 Lt.1
            <br />
            Pondok Pesantren Lirboyo, Kediri
            <br />
            <span className="break-all">
              info@ittihadulmuballighin.or.id
            </span>
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.6fr_0.8fr_1fr]">
          <div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/80">
              Lembaga dakwah, pendidikan, pembinaan muballigh, dan pengabdian
              masyarakat dari Pondok Pesantren Lirboyo, Kediri.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">
              Menu
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">
              Falak
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
              {falakLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground">
              Hubungi Kami
            </h3>
            <div className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-6 sm:hidden">
                  Gedung al Ittihad 1 Lt.1
                  <br />
                  Pondok Pesantren Lirboyo
                </p>
              </div>

              <div className="flex items-center gap-2.5 sm:hidden">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-all">
                  info@ittihadulmuballighin.or.id
                </span>
              </div>

              <Link
                href="https://wa.me/6281367891910"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-white/90"
              >
                <FaWhatsapp size={15} />
                WhatsApp
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-center text-xs text-primary-foreground/70 sm:text-left">
              © 2026 Sekretariat Lembaga Ittihadul Muballighin
            </p>

            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground transition hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                  >
                    <Icon size={14} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
