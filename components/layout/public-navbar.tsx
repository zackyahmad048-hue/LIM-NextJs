// src/components/layout/public-navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  { label: "Beranda", href: "/" },
  { label: "Artikel", href: "/artikel" },
  { label: "Jadwal Shalat", href: "/falak" },
  { label: "Verifikasi Surat", href: "/verifikasi" },
  { label: "Tentang", href: "/tentang" },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicNavbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-[top,padding] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        scrolled ? "top-0 px-0" : "top-3 px-3 sm:top-4 sm:px-5",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full transition-[max-width,border-radius,border-color,background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          scrolled
            ? "max-w-full rounded-none border-b border-border/80 bg-background/88 shadow-sm backdrop-blur-xl"
            : "max-w-7xl rounded-2xl border border-border/60 bg-background/72 shadow-[0_8px_30px_-24px_oklch(0.147_0.004_49.3/0.35)] backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/40"
            aria-label="LIM Digital - Beranda"
          >
            <Image
              src="/logo_lim.svg"
              alt=""
              width={40}
              height={44}
              unoptimized
              className="rounded-md"
            />
            <div className="hidden flex-col sm:flex">
              <span className="text-xs text-muted-foreground">Lembaga</span>
              <span className="text-base font-semibold tracking-tight text-primary">
                Ittihadul Muballighin
              </span>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigasi utama"
          >
            {navigationItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/40",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="public-nav-active"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/15"
                      transition={
                        reduceMotion
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center md:flex">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-5",
              )}
            >
              Masuk
            </Link>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Buka menu navigasi"
                  className="h-10 w-10 rounded-full md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-[320px] border-l-border/70 bg-background/95 backdrop-blur-xl sm:w-[360px]"
            >
              <SheetHeader className="border-b border-border/70 pb-4">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <Image
                    src="/logo_lim.svg"
                    alt=""
                    width={36}
                    height={40}
                    unoptimized
                    className="rounded-md"
                  />
                  <span className="text-base font-semibold">Menu</span>
                </SheetTitle>
              </SheetHeader>

              <nav
                className="mt-6 flex flex-col gap-1 px-3"
                aria-label="Navigasi mobile"
              >
                <AnimatePresence>
                  {isMobileMenuOpen &&
                    navigationItems.map((item, index) => {
                      const isActive = isActivePath(pathname, item.href);
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                          transition={
                            reduceMotion
                              ? { duration: 0.01 }
                              : {
                                  duration: 0.28,
                                  delay: 0.04 + index * 0.04,
                                  ease: [0.22, 1, 0.36, 1],
                                }
                          }
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                              isActive
                                ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </nav>

              <div className="mt-auto border-t border-border/70 p-3 pt-6">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(buttonVariants(), "w-full rounded-xl")}
                >
                  Masuk
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
