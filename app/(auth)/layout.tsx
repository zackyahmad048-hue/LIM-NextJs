import Link from "next/link";
import { House } from "lucide-react";
import AuthGridBackdrop from "@/components/auth/auth-grid-backdrop";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      <AuthGridBackdrop />
      <Link
        href="/"
        className="absolute left-4 top-4 z-20 inline-flex h-10 items-center gap-1.5 rounded-full border border-border/40 bg-background px-3.5 text-sm font-medium text-foreground/80 shadow-sm transition-colors hover:border-primary hover:text-primary"
      >
        <House size={15} />
        Kembali ke beranda
      </Link>
      {children}
    </div>
  );
}
