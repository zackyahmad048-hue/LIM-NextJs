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
    <footer className="border-t border-orange-100 bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_1fr_1fr]">
          <div>
            <h2 className="text-lg font-bold text-orange-400">
              Ittihadul Muballighin
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              Lembaga dakwah, pendidikan, pembinaan muballigh, dan pengabdian
              masyarakat.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Menu</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-orange-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Hubungi Kami</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <p className="leading-6">
                  Gedung al Ittihad 1 Lt.1
                  <br />
                  Pondok Pesantren Lirboyo
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-orange-400" />
                <span className="break-all">
                  info@ittihadulmuballighin.or.id
                </span>
              </div>

              <Link
                href="https://wa.me/6281367891910"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
              >
                <FaWhatsapp size={15} />
                WhatsApp
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Ikuti Kami</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-100 transition hover:-translate-y-0.5 hover:bg-orange-500"
                  >
                    <Icon size={15} />
                  </Link>
                );
              })}
            </div>

            <p className="mt-4 max-w-xs text-xs leading-5 text-slate-400">
              Ikuti informasi terbaru seputar dakwah, kajian, dan program LIM.
            </p>
          </div>
        </div>

        <div className="mt-7 border-t border-white/10 pt-4">
          <p className="text-center text-xs text-slate-500">
            (c) 2026 Sekretariat Lembaga Ittihadul Muballighin
          </p>
        </div>
      </div>
    </footer>
  );
}
