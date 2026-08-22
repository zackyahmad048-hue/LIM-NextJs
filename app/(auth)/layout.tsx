import Link from "next/link";
import { House } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-muted/30">
      <Link
        href="/"
        className="absolute left-4 top-4 z-20 inline-flex h-10 items-center gap-1.5 rounded-full border border-(--glass-border) bg-(--glass-chrome-bg) px-3.5 text-sm font-medium text-foreground/80 backdrop-blur-(--glass-blur) backdrop-saturate-(--glass-saturate) transition-colors hover:border-primary hover:text-primary"
      >
        <House size={15} />
        Kembali ke beranda
      </Link>
      {children}
    </main>
  );
}
