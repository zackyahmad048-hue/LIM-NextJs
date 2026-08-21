"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAdmin, type CreateAdminResult } from "@/actions/create-admin";

const initialState: CreateAdminResult = { ok: true, message: "" };

export default function SetupPage() {
  const [state, formAction, pending] = useActionState(
    createAdmin,
    initialState,
  );

  return (
    <main className="login-aurora flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-md border border-border/10 bg-card p-8 text-center shadow-[0_24px_60px_-24px] shadow-black/20"
      >
        <h1 className="font-sans text-lg font-semibold text-foreground">
          Buat Admin Pertama
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Akun dibuat dari <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_EMAIL</code> dan{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">ADMIN_PASSWORD</code> pada file .env
        </p>

        {state.message && (
          <p
            className={`text-xs leading-5 ${
              state.ok ? "text-primary" : "text-destructive"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          disabled={pending}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Membuat..." : "Buat Admin Pertama"}
        </button>

        <Link
          href="/admin/login"
          className="text-xs font-medium text-primary transition hover:opacity-80"
        >
          Sudah punya akun? Login
        </Link>
      </form>
    </main>
  );
}
