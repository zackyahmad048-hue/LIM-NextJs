"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BIDANG } from "@/config/bidang";

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

const linkPill = cn(
  "flex h-8 items-center gap-1.5 border-b-2 px-2 text-sm font-medium transition-colors",
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const [bidangOpen, setBidangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  const glassActive =
    !prefersReducedMotion && scrolled && typeof window !== "undefined";

  const profilActive = pathname.startsWith("/profil");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        glassActive
          ? "border-[var(--glass-border)] bg-[var(--glass-chrome-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]"
          : "border-border bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Image
            src="/images/orangelim.png"
            alt="Lembaga Ittihadul Muballighin"
            width={999}
            height={1107}
            priority
            className="h-7 w-auto object-contain"
          />

          <span className="leading-tight">
            <span className="block text-[10px] font-medium uppercase text-muted-foreground">
              Lembaga
            </span>
            <span className="block text-[15px] font-semibold text-foreground">
              Ittihadul Muballighin
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu
          className="hidden flex-1 justify-center lg:flex"
          viewport={false}
        >
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={cn(
                    linkPill,
                    pathname === "/"
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/70 hover:border-border/60 hover:text-primary",
                  )}
                >
                  Beranda
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  "h-8 border-b-2 px-2 text-sm font-medium transition-colors",
                  profilActive
                    ? "border-primary text-primary data-open:border-primary data-open:hover:border-primary"
                    : "border-transparent text-foreground/70 hover:border-border/60 hover:text-primary data-open:border-border/60 data-open:text-foreground",
                )}
              >
                Profil
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:top-full md:mt-1.5">
                <div className="w-110 max-w-[calc(100vw-2rem)]">
                  <div className="grid gap-2 p-3 sm:grid-cols-2">
                    <div>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase text-muted-foreground">
                        Profil
                      </p>
                      {profilChildren.map((item) => (
                        <NavigationMenuLink asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
                              pathname === item.href
                                ? "bg-primary/10 text-primary hover:bg-primary/10"
                                : "text-foreground/80",
                            )}
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>

                    <div>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase text-muted-foreground">
                        Bidang
                      </p>
                      {BIDANG.map((bidang) => (
                        <NavigationMenuLink asChild key={bidang.slug}>
                          <Link
                            href={`/profil/bidang/${bidang.slug}`}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
                              pathname === `/profil/bidang/${bidang.slug}`
                                ? "bg-primary/10 text-primary hover:bg-primary/10"
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
                    linkPill,
                    pathname === item.href
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground/70 hover:border-border/60 hover:text-primary",
                  )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <Link
            href="/admin/login"
            className="hidden h-8 items-center border-b-2 border-transparent px-2 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary lg:inline-flex"
          >
            Admin
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Buka menu"
                aria-expanded={open}
                className="rounded-full p-2 transition hover:bg-accent lg:hidden"
              >
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="gap-0 p-0">
              <SheetTitle className="sr-only">Menu navigasi</SheetTitle>

              <div className="flex items-center gap-3 border-b border-border/10 px-4 py-4">
                <Image
                  src="/images/orangelim.png"
                  alt=""
                  width={999}
                  height={1107}
                  className="h-6 w-auto object-contain"
                />
                <span className="leading-tight">
                  <span className="block text-[10px] font-medium uppercase text-muted-foreground">
                    Lembaga
                  </span>
                  <span className="block text-[15px] font-semibold text-foreground">
                    Ittihadul Muballighin
                  </span>
                </span>
              </div>

              <nav className="flex-1 overflow-y-auto p-3">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
                    pathname === "/"
                      ? "bg-primary/10 font-medium text-primary hover:bg-primary/10"
                      : "text-foreground/80",
                  )}
                >
                  Beranda
                </Link>

                <button
                  type="button"
                  onClick={() => setProfilOpen(!profilOpen)}
                  aria-expanded={profilOpen}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
                    profilActive
                      ? "bg-primary/10 font-medium text-primary hover:bg-primary/10"
                      : "text-foreground/80",
                  )}
                >
                  Profil
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      profilOpen && "rotate-180",
                    )}
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
                          "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
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
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      Bidang
                      <ChevronRight
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          bidangOpen && "rotate-90",
                        )}
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
                              "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
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
                      "flex items-center rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
                      pathname === item.href
                        ? "bg-primary/10 font-medium text-primary hover:bg-primary/10"
                        : "text-foreground/80",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border/10 p-3">
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-border px-3.5 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Login Admin
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
