"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Menu } from "lucide-react";
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
import GlobalSearchPalette from "@/components/website/search/global-search-palette";

const profilChildren = [
  { title: "Tentang LIM", href: "/profil/tentang" },
  { title: "Visi & Misi", href: "/profil/visi-misi" },
  { title: "Pengurus Pusat", href: "/profil/pengurus-pusat" },
];

const navLinks = [
  { title: "Artikel", href: "/artikel" },
  { title: "Kontak", href: "/kontak" },
];

const linkClass = cn(
  "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors",
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profilOpen, setProfilOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  const profilActive = pathname.startsWith("/profil");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none",
        scrolled ? "px-0 pt-0" : "px-4 pt-3 sm:pt-4",
      )}
    >
      <div
        className={cn(
          "border border-border/40 bg-(--glass-chrome-bg) backdrop-blur-(--glass-blur) backdrop-saturate-(--glass-saturate) transition-[width,border-radius,box-shadow,border-color] duration-300 ease-in-out motion-reduce:transition-none",
          scrolled
            ? "w-full rounded-none border-x-0"
            : "mx-auto max-w-5xl rounded-full",
        )}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2.5">
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
                      linkClass,
                      pathname === "/"
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-primary",
                    )}
                  >
                    Beranda
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors data-open:bg-transparent",
                    profilActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-primary data-open:text-foreground",
                  )}
                >
                  Profil
                </NavigationMenuTrigger>
                <NavigationMenuContent className="md:top-full md:mt-1.5">
                  <div className="w-56 max-w-[calc(100vw-2rem)]">
                    <div className="grid gap-2 p-3">
                      <div>
                        <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase text-muted-foreground">
                          Profil
                        </p>
                        {profilChildren.map((item) => (
                          <NavigationMenuLink asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "block rounded-sm px-3 py-2 text-sm transition-colors",
                                pathname === item.href
                                  ? "font-medium text-primary"
                                  : "text-foreground/80 hover:text-primary",
                              )}
                            >
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/profil/bidang"
                    className={cn(
                      linkClass,
                      pathname === "/profil/bidang" ||
                        pathname.startsWith("/profil/bidang/")
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground/70 hover:bg-accent hover:text-primary",
                    )}
                  >
                    Bidang
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {navLinks.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        linkClass,
                        pathname === item.href
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground/70 hover:bg-accent hover:text-primary",
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
            <GlobalSearchPalette />

            <ThemeToggle />

            <Link
              href="/admin/login"
              className="hidden h-8 items-center rounded-full px-3 text-xs font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-primary lg:inline-flex"
            >
              Admin
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Buka menu"
                  aria-expanded={open}
                  className="rounded-md border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary active:scale-95 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
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
                      "flex items-center rounded-full px-3.5 py-2.5 text-sm transition-colors",
                      pathname === "/"
                        ? "font-medium text-primary"
                        : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    Beranda
                  </Link>

                  <button
                    type="button"
                    onClick={() => setProfilOpen(!profilOpen)}
                    aria-expanded={profilOpen}
                    className={cn(
                      "flex w-full items-center justify-between rounded-full px-3.5 py-2.5 text-sm transition-colors",
                      profilActive
                        ? "font-medium text-primary"
                        : "text-foreground/80 hover:text-primary",
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
                            "block rounded-full px-3 py-2 text-sm transition-colors",
                            pathname === item.href
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-primary",
                          )}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/profil/bidang"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-full px-3.5 py-2.5 text-sm transition-colors",
                      pathname === "/profil/bidang" ||
                        pathname.startsWith("/profil/bidang/")
                        ? "font-medium text-primary"
                        : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    Bidang
                  </Link>

                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center rounded-full px-3.5 py-2.5 text-sm transition-colors",
                        pathname === item.href
                          ? "font-medium text-primary"
                          : "text-foreground/80 hover:text-primary",
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
                    className="block rounded-sm border border-border px-3.5 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Login Admin
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
