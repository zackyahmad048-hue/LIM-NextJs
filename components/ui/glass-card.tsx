import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * Kartu kaca global ("Kaca Kristal") — chrome + kartu.
 *
 * Server Component, CSS-only. Nilai warna/blur dari token `--glass-*`
 * di `app/globals.css` (berlaku publik & admin, light & dark, fallback
 * `prefers-reduced-transparency`). Saturasi menjaga keterbacaan teks di
 * atas konten yang lewat di belakangnya (pola Apple/Fey).
 */
export function GlassCard({ children, className, as }: GlassCardProps) {
  const Tag = as ?? "div";

  return (
    <Tag
      className={cn(
        "relative border border-[var(--glass-border)] bg-[var(--glass-card-bg)]",
        "backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]",
        "shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3),var(--glass-highlight)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}