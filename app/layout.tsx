import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter, Reem_Kufi } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "sonner";
import { AppThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = GeistSans;

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-data",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fx-ar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lembaga Ittihadul Muballighin",
  description: "Platform Manajemen Organisasi Lembaga Ittihadul Muballighin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ segments?: string[] }>;
}>) {
  const segments = (await params).segments ?? [];
  if (segments[0] === "(payload)") {
    return <>{children}</>;
  }
  return (
    <html
      lang="id"
        className={cn(
          "h-full",
          "antialiased",
          geistSans.variable,
          inter.variable,
          jetbrainsMono.variable,
          reemKufi.variable,
          "font-body",
        )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background/55 text-foreground">
        <span
          className="hidden"
          aria-hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: LIM is the pesantren institution whose proof is a live almanac — the day's prayer reckoning computed on the page itself; authority shown as demonstrated skill, clean like an official portal, not a decorative billboard.
OWN-WORLD: Khusyu Minimalis — dual-mode canvas (light white / dark near-black via --background token, see app/globals.css; light oklch(1 0 0), dark oklch(0.145 0 0)), Oranye LIM --primary oklch(0.553 0.195 38.402) as tactical accent only (CTA, active underline, status, focus ring); flat solid surfaces, cards border-primary/25, no drop shadow, rounded-sm/md (chrome navbar rounded-2xl at top), glassmorphism only on navbar. Geist Sans display (geometric sans), Inter body, JetBrains Mono falak/data, Reem Kufi Arabic.
STORY: a visitor reads today's taqwim for Lirboyo, sees one institution from Kediri reaching the whole archipelago, and trusts it.
FIRST VIEWPORT: full-bleed iksadari.JPG subtle overlay behind a dominant Geist Sans headline on the left, Inter tagline, two CTAs (primary "Jadwal Shalat Hari Ini" to /falak/jadwal-shalat + secondary outline), shalat widget on the right, and 3 hero stats in tabular numbers below the fold.
FORM: Khusyu Minimalis — Sampaikan dariku walau satu ayat.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <AppThemeProvider attribute="class" defaultTheme="dark">
          <AntdRegistry>{children}</AntdRegistry>
          <Toaster richColors position="top-right" closeButton />
        </AppThemeProvider>
      </body>
    </html>
  );
}
