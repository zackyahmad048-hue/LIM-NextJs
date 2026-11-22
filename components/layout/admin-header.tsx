// components/layout/admin-header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

interface AdminHeaderProps {
  userName: string;
  userEmail: string;
  userRole: string;
  userImage?: string | null;
}

export function AdminHeader({
  userName,
  userEmail,
  userRole,
  userImage,
}: AdminHeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-white/15 bg-card/78 shadow-[0_8px_30px_-24px_oklch(0.147_0.004_49.3/0.45)] backdrop-blur-xl dark:bg-card/65"
          : "border-white/10 bg-card/55 backdrop-blur-md dark:bg-card/40",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            LIM
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-foreground sm:block">
            Konsol Pusat
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 w-9 rounded-full p-0"
                aria-label="Menu profil"
              />
            }
          >
            <Avatar className="h-9 w-9 border border-border">
              {userImage && <AvatarImage src={userImage} alt={userName} />}
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
                <Badge
                  variant="secondary"
                  className="mt-1 w-fit bg-primary/10 text-primary"
                >
                  {userRole.replace(/_/g, " ")}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard/pengguna" />}>
              <User className="mr-2 h-4 w-4 text-muted-foreground" /> Profil
              Saya
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
