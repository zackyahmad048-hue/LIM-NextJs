import type { Metadata, Viewport } from "next";
import {
  Hanken_Grotesk,
  Newsreader,
  Reem_Kufi,
  Roboto,
  Spline_Sans_Mono,
} from "next/font/google";
import { Toaster } from "sonner";
import { AppThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--f-site",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--fx-display",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fx-ar",
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fx-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        hanken.variable,
        newsreader.variable,
        reemKufi.variable,
        splineMono.variable,
        "font-sans",
        roboto.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background/55 text-foreground transition-colors">
        <span
          className="hidden"
          aria-hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: LIM is the pesantren institution whose proof is a live almanac — the day's prayer reckoning computed on the page itself; authority shown as demonstrated skill, clean like an official portal, not a decorative billboard.
OWN-WORLD: Oranye LIM — white / neutral-950 grounds with official orange accents (the semantic tokens), solid orange footer band, no glass on public surfaces; serif display (Newsreader), Hanken Grotesk body, Reem Kufi Arabic marginalia, Spline Sans Mono instrument numerals.
STORY: a visitor reads today's taqwim for Lirboyo, sees one institution from Kediri reaching the whole archipelago, and trusts it.
FIRST VIEWPORT: left column headed by the display serif, the hairline "Capaian Dakwah" rule, the live Taqwim folio (glass) entering from the right, the dakwah route map drawing itself from Kediri below; entrance motion comes from the sides.
FORM: Oranye LIM, seed lim-oranye-2026.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
          }}
        />
        <AppThemeProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster richColors position="top-right" closeButton />
        </AppThemeProvider>
      </body>
    </html>
  );
}
