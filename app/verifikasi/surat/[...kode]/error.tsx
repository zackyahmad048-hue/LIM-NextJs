"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Halaman ini muncul ketika sistem sedang tidak dapat memeriksa, bukan ketika
 * suratnya bermasalah. Pembaca baru saja memindai QR di surat resmi, jadi
 * kalimat di bawah sengaja tidak menyebut apa pun soal keabsahan surat.
 */
export default function VerifyLetterError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="site min-h-dvh bg-background text-foreground">
      <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-16">
        <header className="flex items-center gap-3">
          <Link href="/" aria-label="LIM Digital Platform - kembali ke beranda">
            <Image
              src="/images/orangelim.png"
              alt="Logo Lembaga Ittihadul Muballighin"
              width={38}
              height={38}
              priority
            />
          </Link>
          <div>
            <p className="text-sm font-semibold">Lembaga Ittihadul Muballighin</p>
            <p className="font-data text-[11px] uppercase tracking-wide text-muted-foreground">
              Verifikasi surat
            </p>
          </div>
        </header>

        <div className="mt-7 h-1 w-full rounded-full bg-destructive" />

        <h1 className="mt-6 font-heading text-2xl font-semibold text-balance sm:text-[28px] sm:leading-snug">
          Sistem sedang tidak dapat memeriksa.
        </h1>

        <p className="mt-4 max-w-prose text-sm leading-6 text-muted-foreground">
          Ini gangguan di sisi kami, bukan tanda bahwa surat Anda tidak sah.
          Nomor Anda belum diperiksa, jadi belum ada jawaban yang bisa diberikan
          sekarang.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={reset}>
            Coba lagi
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/kontak">Hubungi sekretariat</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
