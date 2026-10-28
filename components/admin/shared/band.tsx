import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BandHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Header band (judul + deskripsi + slot aksi). Dipakai sendiri atau oleh `Band`. */
 function BandHeader({
  title,
  description,
  actions,
  className,
}: BandHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      {title != null && (
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-admin-content-fg">{title}</h2>
          {description != null && (
            <p className="mt-1 text-sm text-admin-content-fg/80">{description}</p>
          )}
        </div>
      )}
      {actions != null && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

interface BandProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Tint modul pada permukaan kaca: satu tint per kartu, sesuai modulnya
   *  (skill UI/UX Glassmorphism §Aturan Glass). */
  tint?: "falak" | "program" | "sekretariat" | "konten" | "sistem";
  /** "plain" = divider-row tanpa kotak (default, untuk section ringkasan);
   *  "raised" = permukaan kaca untuk form, tabel, dan kartu. */
  variant?: "plain" | "raised";
  /** Tampilkan garis pemisah atas pada variant plain. Default true.
   *  Set false untuk band pertama / tanpa pemisah (gantikan hack border-t-0 pt-0). */
  divider?: boolean;
  className?: string;
}

const tintClass: Record<NonNullable<BandProps["tint"]>, string> = {
  falak: "glass-tint-falak",
  program: "glass-tint-program",
  sekretariat: "glass-tint-sekretariat",
  konten: "glass-tint-konten",
  sistem: "glass-tint-sistem",
};

/** Permukaan "band". "plain" = pemisah section tanpa kotak; "raised" = permukaan
 *  kaca (`.glass` menyediakan border, background, dan shadow sendiri — jangan
 *  ditimpa utility manual). Satu standar radius/padding. */
export function Band({
  children,
  title,
  description,
  actions,
  tint,
  variant = "plain",
  divider = true,
  className,
}: BandProps) {
  const hasHeader = title != null || description != null || actions != null;

  return (
    <section
      className={cn(
        variant === "plain" && divider && "border-t border-admin-border pt-4 lg:pt-5",
        variant === "plain" && !divider && "pt-0",
        variant === "raised" && "glass rounded-xl p-4 lg:p-5",
        variant === "raised" && tint && tintClass[tint],
        className,
      )}
    >
      {hasHeader && (
        <BandHeader title={title} description={description} actions={actions} className="mb-5" />
      )}
      {children}
    </section>
  );
}