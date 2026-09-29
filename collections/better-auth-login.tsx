import type { AdminViewServerProps } from "payload";
import Link from "next/link";
import { redirect } from "next/navigation";

/**
 * `/cms/login` has no form to show: `disableLocalStrategy` hides Payload's own
 * login form, because Better Auth is the only identity provider. A redirect
 * alone would loop — the strategy authenticates the visitor before this
 * renders — so this sends them to the application's login instead.
 */
export function BeforeLogin({ user }: AdminViewServerProps) {
  if (user) {
    redirect("/cms");
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm">
        Masuk melalui halaman login aplikasi untuk mengakses CMS.
      </p>
      <Link
        href="/login"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Ke halaman login
      </Link>
    </div>
  );
}
