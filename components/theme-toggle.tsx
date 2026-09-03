"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

import { useThemeToggle } from "@/components/ui/skiper-ui/skiper26";

function noop() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/**
 * Saklar tema — pill dengan thumb bundar (Sun/Moon) yang bergeser.
 * Perpindahan tema memakai `useThemeToggle` (Skiper UI) dengan variant
 * "rectangle" + start "bottom-up" → reveal vertikal (swipe ke atas)
 * lewat View Transitions API.
 */
export function ThemeToggle() {
  const mounted = useMounted();
  const { isDark, toggleTheme } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });

  if (!mounted) {
    // Placeholder berukuran sama agar navbar tidak bergeser saat tombol mount.
    return (
      <span
        aria-hidden
        className="inline-block h-9 w-[4.25rem] rounded-full border border-transparent"
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Ganti tema ke terang" : "Ganti tema ke gelap"}
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-[4.25rem] items-center rounded-full border border-primary/30 bg-primary/10 transition-colors hover:border-primary/60 hover:bg-primary/20"
    >
      {/* Ikon-ikon statis di kedua sisi pill */}
      <Moon className="absolute right-2.5 size-3.5 text-primary/70" />
      <Sun className="absolute left-2.5 size-3.5 text-primary/70" />

      {/* Thumb bundar yang bergeser mengikuti tema */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 460, damping: 30, mass: 0.55 }}
        className="absolute left-1 top-1 flex size-7 items-center justify-center rounded-full bg-card text-primary shadow-sm"
      >
        {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      </motion.span>
    </button>
  );
}
