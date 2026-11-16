"use client";

import { FormEvent, useEffect, useState } from "react";
import { createRealtimeClient } from "@neon/realtime/client";
import type { SealedLiveQuery } from "@neon/realtime/client";
import { authClient } from "@/lib/auth/client";

type Result = { message: string; error?: boolean };
type RealtimeRow = { ok: number };

async function readResult(response: Response): Promise<Result> {
  const body = (await response.json()) as { message?: string; error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }
  return { message: body.message ?? "Request completed." };
}

export default function Home() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    let active = true;
    void authClient.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthMessage(error.message ?? "Could not load session.");
        return;
      }
      setSession(data?.user?.email ?? null);
    }).catch((error: unknown) => {
      if (active) setAuthMessage(error instanceof Error ? error.message : "Could not load session.");
    });
    return () => {
      active = false;
    };
  }, []);

  async function checkService(name: string, url: string, init?: RequestInit) {
    setPending(name);
    setResults((current) => ({ ...current, [name]: { message: "Checking..." } }));
    try {
      const response = await fetch(url, init);
      const result = await readResult(response);
      setResults((current) => ({ ...current, [name]: result }));
    } catch (error) {
      setResults((current) => ({
        ...current,
        [name]: { message: error instanceof Error ? error.message : "Request failed.", error: true },
      }));
    } finally {
      setPending(null);
    }
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");
    const submitter = event.nativeEvent instanceof SubmitEvent ? event.nativeEvent.submitter : null;
    const action = submitter instanceof HTMLButtonElement && submitter.value === "sign-up" ? "sign-up" : "sign-in";
    try {
      const result = action === "sign-up"
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setAuthMessage(result.error.message ?? "Authentication failed.");
        return;
      }
      setSession(result.data.user.email ?? result.data.user.name ?? "Signed in");
      setAuthMessage(action === "sign-up" ? "Account created." : "Signed in.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  }

  async function signOut() {
    setAuthMessage("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setAuthMessage(result.error.message ?? "Sign out failed.");
        return;
      }
      setSession(null);
      setAuthMessage("Signed out.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Sign out failed.");
    }
  }

  async function subscribeRealtime() {
    setPending("realtime");
    setResults((current) => ({ ...current, realtime: { message: "Connecting..." } }));
    try {
      const response = await fetch("/api/realtime", { method: "POST" });
      const { query, url } = (await response.json()) as {
        query?: SealedLiveQuery<RealtimeRow>;
        url?: string;
        error?: string;
      };
      if (!response.ok || !query || !url) {
        throw new Error("Realtime could not create a live query.");
      }
      const client = createRealtimeClient({ url });
      const subscription = client.subscribe(query);
      subscription.onChange((snapshot) => {
        if (snapshot.status === "error") {
          setResults((current) => ({
            ...current,
            realtime: { message: snapshot.error.message, error: true },
          }));
        } else if (snapshot.data) {
          const value = snapshot.data[0]?.ok ?? "no rows";
          setResults((current) => ({
            ...current,
            realtime: { message: `Live subscription connected. Query result: ${value}.` },
          }));
          subscription.unsubscribe();
          client.close();
        }
      });
      subscription.onStateChange((state) => {
        if (state.status === "error") {
          setResults((current) => ({
            ...current,
            realtime: { message: state.error.message, error: true },
          }));
          subscription.unsubscribe();
          client.close();
        }
      });
    } catch (error) {
      setResults((current) => ({
        ...current,
        realtime: { message: error instanceof Error ? error.message : "Realtime check failed.", error: true },
      }));
    } finally {
      setPending(null);
    }
  }

  const services = [
    { key: "postgres", label: "Postgres", description: "Run a read-only query against your Neon database.", run: () => checkService("postgres", "/api/health") },
    { key: "functions", label: "Neon Functions", description: "Call the deployed hello function on this branch.", run: () => checkService("functions", "/api/function") },
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Neon integration</p>
        <h1 className="text-4xl font-semibold tracking-tight">Neon services are connected</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Exercise the production branch services from this Next.js app. Server credentials stay on the server; only a short-lived sealed query and the Realtime URL reach your browser.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.key} className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <h2 className="text-xl font-semibold">{service.label}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{service.description}</p>
            </div>
            <button disabled={pending !== null} onClick={service.run} className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
              {pending === service.key ? "Checking..." : `Test ${service.label}`}
            </button>
            {results[service.key] && <p role="status" className={`wrap-break-word text-sm ${results[service.key].error ? "text-red-600" : "text-emerald-700 dark:text-emerald-400"}`}>{results[service.key].message}</p>}
          </article>
        ))}

        <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <h2 className="text-xl font-semibold">Realtime</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Seal a server-side query and subscribe to its live result.</p>
          </div>
          <button disabled={pending !== null} onClick={subscribeRealtime} className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
            {pending === "realtime" ? "Connecting..." : "Test Realtime"}
          </button>
          {results.realtime && <p role="status" className={`wrap-break-word text-sm ${results.realtime.error ? "text-red-600" : "text-emerald-700 dark:text-emerald-400"}`}>{results.realtime.message}</p>}
        </article>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-xl font-semibold">Managed Auth</h2>
        {session ? (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p>Signed in as <strong>{session}</strong></p>
            <button onClick={signOut} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Sign out</button>
          </div>
        ) : (
          <form onSubmit={submitAuth} className="mt-4 grid max-w-md gap-3">
            <label className="grid gap-1 text-sm">Name (for sign up)<input name="name" autoComplete="name" className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" /></label>
            <label className="grid gap-1 text-sm">Email<input name="email" type="email" required autoComplete="email" className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" /></label>
            <label className="grid gap-1 text-sm">Password<input name="password" type="password" required minLength={8} autoComplete="current-password" className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700" /></label>
            <div className="flex gap-3">
              <button type="submit" name="action" value="sign-in" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Sign in</button>
              <button type="submit" name="action" value="sign-up" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700">Create account</button>
            </div>
          </form>
        )}
        {authMessage && <p role="status" className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{authMessage}</p>}
      </section>
    </main>
  );
}
