"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const profilChildren = [
  { title: "Tentang LIM", href: "/profil/tentang" },
  { title: "Visi & Misi", href: "/profil/visi-misi" },
  { title: "Pengurus Pusat", href: "/profil/pengurus-pusat" },
];

const bidangItems = [
  { title: "Tim Wajib Khidmah", href: "/profil/bidang/tim-wajib-khidmah" },
  { title: "Safari Ramadan", href: "/profil/bidang/safari-ramadan" },
  { title: "Safari Dakwah Rutinan", href: "/profil/bidang/safari-dakwah-rutinan" },
  { title: "Penelitian & Pengembangan", href: "/profil/bidang/penelitian-pengembangan" },
  { title: "Pesantren Ramadan", href: "/profil/bidang/pesantren-ramadan" },
  { title: "Dakwah Digital", href: "/profil/bidang/dakwah-digital" },
  { title: "Pendidikan & Kaderisasi", href: "/profil/bidang/pendidikan-kaderisasi" },
  { title: "Pemberdayaan Ekonomi", href: "/profil/bidang/pemberdayaan-ekonomi" },
];

const menus = [
  { title: "Beranda", href: "/" },
  { title: "Artikel", href: "/artikel" },
  { title: "Media", href: "/media" },
  { title: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const [bidangOpen, setBidangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Lembaga Ittihadul Muballighin"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-lg bg-sky-500 object-contain invert"
          />

          <div>
            <p className="text-[11px] font-semibold leading-4 text-slate-700 dark:text-slate-300">
              LIM Official
            </p>
            <p className="text-sm font-bold leading-5 text-slate-800 dark:text-white">
              Ittihadul <span className="text-orange-500">Muballighin</span>
            </p>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {menus.slice(0, 1).map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="text-sm font-medium text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
            >
              {menu.title}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setProfilOpen(true)}
            onMouseLeave={() => { setProfilOpen(false); setBidangOpen(false); }}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
            >
              Profil
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${profilOpen ? "rotate-180" : ""}`} />
            </button>

            {profilOpen && (
              <div className="absolute left-0 top-full z-50 mt-0.5 w-56 rounded-lg border border-orange-100 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85">
                {profilChildren.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {item.title}
                  </Link>
                ))}

                <div className="my-1 border-t border-orange-100 dark:border-slate-700" />

                <div
                  className="relative"
                  onMouseEnter={() => setBidangOpen(true)}
                  onMouseLeave={() => setBidangOpen(false)}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Bidang
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${bidangOpen ? "rotate-180" : ""}`} />
                  </button>

                  {bidangOpen && (
                    <div className="absolute left-full top-0 z-50 ml-0.5 w-56 rounded-lg border border-orange-100 bg-white/85 p-1.5 shadow-lg backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85">
                      {bidangItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {menus.slice(1).map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className="text-sm font-medium text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
            >
              {menu.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Admin
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-md p-1.5 transition hover:bg-orange-50 dark:hover:bg-slate-800"
          >
            {open ? (
              <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-orange-100 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 lg:hidden">
          <nav className="flex flex-col p-3">
            {menus.slice(0, 1).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
              >
                {menu.title}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setProfilOpen(!profilOpen)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
            >
              Profil
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${profilOpen ? "rotate-180" : ""}`} />
            </button>

            {profilOpen && (
              <div className="ml-3 space-y-0.5 border-l border-orange-100 pl-3 dark:border-slate-700">
                {profilChildren.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-1.5 text-sm text-slate-600 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
                  >
                    {item.title}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setBidangOpen(!bidangOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm text-slate-600 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
                >
                  Bidang
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${bidangOpen ? "rotate-180" : ""}`} />
                </button>

                {bidangOpen && (
                  <div className="ml-3 space-y-0.5 border-l border-orange-100 pl-3 dark:border-slate-700">
                    {bidangItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-1.5 text-xs text-slate-500 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {menus.slice(1).map((menu) => (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-slate-700 transition hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-400"
              >
                {menu.title}
              </Link>
            ))}

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Login Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
