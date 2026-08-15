import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children?: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * Permukaan kaca situs publik ("Kaca Kristal").
 *
 * Server Component — hanya CSS `backdrop-filter`, tanpa JavaScript/WebGL.
 * Nilai warna/blur dari token `--glass-*` di `app/globals.css`
 * (berlaku publik & admin, light & dark, fallback
 * `prefers-reduced-transparency`).
 */
export function GlassPanel({ children, className, as }: GlassPanelProps) {
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