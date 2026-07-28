"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/modules/authentication/infrastructure/better-auth-client";
import { Button } from "@/components/ui/button";

export function UserMenu() {
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
        <div className="h-7 w-7 rounded-full bg-muted" />

        <div>
          <p className="text-xs font-medium">Super Admin</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
