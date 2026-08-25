/**
 * Chrome bersama admin — glass & permukaan kartu ala aplikasi DIGDAYA
 * dengan token desain LIM.
 *
 * File biasa (bukan "use client") agar aman dipakai Server Component.
 * Sumber tunggal: jangan duplikasi string token --glass-* di komponen lain.
 */

/** Glass chrome untuk bar/sidebar/panel mengambang (scrim lebih pekat). */
export const glassChrome =
  "border-[var(--glass-border)] bg-[var(--glass-chrome-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]";

/** Permukaan kartu glass (lebih transparan dari chrome). */
export const glassCard =
  "border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]";

/** Kartu standar: radius besar, border halus, shadow lembut. */
export const softCard = "border-border/70 bg-card shadow-sm";
