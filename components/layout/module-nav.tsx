// components/layout/module-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/components/layout/nav-config";

// Navigasi modul horizontal untuk Konsol Pusat (OWNER).
export function ModuleNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Navigasi modul"
      className={cn(
        "border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-white/15 bg-card/70 backdrop-blur-xl dark:bg-card/55"
          : "border-white/10 bg-card/45 backdrop-blur-md dark:bg-card/35",
      )}
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-1 sm:px-6 lg:px-8">
        {groups
          .flatMap((group) => group.items)
          .map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  active
                    ? "bg-white/12 text-white ring-1 ring-white/15"
                    : "text-white/72 hover:bg-white/8 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
