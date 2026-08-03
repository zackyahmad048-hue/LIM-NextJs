"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BIDANG } from "@/config/bidang";
import { HubDot } from "@/components/shared/hub-dot";

const profilChildren = [
  { title: "Tentang LIM", href: "/profil/tentang" },
  { title: "Visi & Misi", href: "/profil/visi-misi" },
  { title: "Pengurus Pusat", href: "/profil/pengurus-pusat" },
];

const navLinks = [
  { title: "Artikel", href: "/artikel" },
  { title: "Media", href: "/media" },
  { title: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const [bidangOpen, setBidangOpen] = useState(false);

  const profilActive = pathname.startsWith("/profil");

  return (
    <header className="sticky top-0 z-50 border-b border-border/10 bg-background/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-10 w-10 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-primary/50 transition-colors group-hover:border-primary" />
            <Image
              src="/images/logo.png"
              alt="Lembaga Ittihadul Muballighin"
              width={30}
              height={30}
              priority
              className="h-7 w-7 rounded-full object-contain dark:invert"
            />
          </span>

          <span className="leading-tight">
            <span className="block text-[10px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
              Lembaga
            </span>
            <span className="block font-sans text-base font-semibold tracking-wide text-foreground">
              Ittihadul Muballighin
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    pathname === "/"
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary",
                  )}
                >
                  {pathname === "/" && <HubDot className="h-2 w-2" />}
                  Beranda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "text-sm font-medium",
                  profilActive ? "text-primary" : "text-foreground/80",
                )}
              >
                Profil
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:top-full md:mt-1.5">
                <div className="w-110 max-w-[calc(100vw-2rem)]">
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="px-3 pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        Profil
                      </p>
                      {profilChildren.map((item) => (
                        <NavigationMenuLink asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "text-sm",
                              pathname === item.href
                                ? "text-primary"
                                : "text-foreground/80",
                            )}
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <p className="px-3 pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                        Bidang
                      </p>
                      {BIDANG.map((bidang) => (
                        <NavigationMenuLink asChild key={bidang.slug}>
                          <Link
                            href={`/profil/bidang/${bidang.slug}`}
                            className={cn(
                              "text-sm",
                              pathname === `/profil/bidang/${bidang.slug}`
                                ? "text-primary"
                                : "text-foreground/80",
                            )}
                          >
                            {bidang.title}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium",
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    {pathname === item.href && <HubDot className="h-2 w-2" />}
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="text-xs font-medium tracking-wide text-muted-foreground transition hover:text-primary"
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
            aria-label="Buka menu"
            aria-expanded={open}
            className="rounded-md p-1.5 transition hover:bg-accent"
          >
            {open ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/10 bg-background lg:hidden">
          <nav className="flex flex-col p-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition hover:text-primary",
                pathname === "/"
                  ? "font-medium text-primary"
                  : "text-foreground/80",
              )}
            >
              {pathname === "/" && <HubDot className="h-2 w-2" />}
              Beranda
            </Link>

            <button
              type="button"
              onClick={() => setProfilOpen(!profilOpen)}
              aria-expanded={profilOpen}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:text-primary"
            >
              <span className={profilActive ? "font-medium text-primary" : "text-foreground/80"}>
                Profil
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${profilOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profilOpen && (
              <div className="ml-3 space-y-0.5 border-l border-border/15 pl-3">
                {profilChildren.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition hover:text-primary",
                      pathname === item.href
                        ? "font-medium text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setBidangOpen(!bidangOpen)}
                  aria-expanded={bidangOpen}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition hover:text-primary"
                >
                  Bidang
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${bidangOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {bidangOpen && (
                  <div className="ml-3 space-y-0.5 border-l border-border/15 pl-3">
                    {BIDANG.map((bidang) => (
                      <Link
                        key={bidang.slug}
                        href={`/profil/bidang/${bidang.slug}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-1.5 text-sm transition hover:text-primary",
                          pathname === `/profil/bidang/${bidang.slug}`
                            ? "font-medium text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {bidang.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition hover:text-primary",
                  pathname === item.href
                    ? "font-medium text-primary"
                    : "text-foreground/80",
                )}
              >
                {pathname === item.href && <HubDot className="h-2 w-2" />}
                {item.title}
              </Link>
            ))}

            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-md border border-border/25 px-3 py-2 text-center text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              Login Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
