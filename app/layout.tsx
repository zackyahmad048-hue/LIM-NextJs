import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { AppThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--f-site",
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
      className={cn("h-full", "antialiased", hanken.variable, "font-sans", roboto.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background/55 text-foreground transition-colors">
        <span
          className="hidden"
          aria-hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: LIM is an official institution of the pesantren world — warm official orange, clean like an official portal, and the proof is the live prayer data pinned to the page.
OWN-WORLD: Oranye LIM — white surfaces with official orange accents (orange-700/800), neutral zinc tints, solid orange footer band; no glass, no glow, no board textures.
STORY: a visitor reads today's official schedule, sees what LIM is doing now, and trusts one institution from Kediri that reaches the whole archipelago.
FIRST VIEWPORT: headline and orange actions left, today's prayer schedule card right, the dakwah route map drawing itself from Kediri below.
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
