import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Falak | LIM Digital Platform",
  description:
    "Layanan falak: jadwal shalat, arah kiblat, kalender Hijriah, hisab, dan rukyat.",
};

export default function FalakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
