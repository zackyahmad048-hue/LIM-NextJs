"use client";

import type { AdminViewClientProps } from "payload";
import { useRouter } from "next/navigation";

/**
 * Payload's Logout client component only clears Payload's own session. With
 * `disableLocalStrategy: true` it calls an operation that does nothing, then
 * redirects back to the login page — where the delegated strategy immediately
 * re-authenticates the user, who never actually signed out.
 *
 * This calls Better Auth's sign-out endpoint so the session cookie is really
 * destroyed, then returns to the login page with the admin session gone.
 */
export function BetterAuthLogout(_props: AdminViewClientProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="nav-group__label"
      style={{ width: "100%", textAlign: "left" }}
    >
      Keluar
    </button>
  );
}
