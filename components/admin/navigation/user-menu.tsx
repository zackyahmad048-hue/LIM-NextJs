"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
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

  async function handleLogout() {
    await authClient.signOut();
    toast.success("Berhasil logout.");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2.5 md:flex">
        <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
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
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
