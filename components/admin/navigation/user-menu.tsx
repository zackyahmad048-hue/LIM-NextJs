"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/modules/authentication/infrastructure/better-auth-client";
import { Button } from "@/components/ui/button";

interface UserMenuUser {
  name: string;
  email: string;
  image: string | null;
  roleLabel: string;
}

interface Props {
  user: UserMenuUser;
}

export function UserMenu({ user }: Props) {
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await authClient.signOut();
    if (error) {
      toast.error("Gagal logout. Silakan coba lagi.");
      setLoggingOut(false);
      return;
    }
    toast.success("Berhasil logout.");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2.5 md:flex">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <p className="max-w-40 truncate text-xs font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.roleLabel}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="Logout"
        title="Logout"
        aria-busy={loggingOut}
      >
        {loggingOut ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
