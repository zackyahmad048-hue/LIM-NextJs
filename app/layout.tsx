import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import "./globals.css";

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
      lang="en"
      className="h-full font-sans antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background/55 text-foreground transition-colors">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
        </body>
    </html>
  );
}
