import { formatDateId } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Stamp } from "lucide-react";

import { LETTER_TYPES } from "@/config/letter-types";
import {
  classifyVerification,
  getOutgoingMailByVerificationCode,
  type VerificationVerdict,
} from "@/modules/secretariat";
import { LetterPlate } from "@/components/shared/letter-plate";
import { VerificationForm } from "../verification-form";
import Reveal from "@/components/website/motion/reveal";

/**
 * Nada hasil. Warna hanya penguat — keadaan selalu dinyatakan dengan kata,
 * sehingga pembaca yang tidak dapat membedakan warna tetap menerima jawabannya.
 */
const TONE: Record<VerificationVerdict["kind"], { rule: string; accent: string }> =
  {
    sah: { rule: "bg-success", accent: "text-success" },
    "tidak-berlaku": { rule: "bg-warning", accent: "text-warning" },
    "tidak-ditemukan": { rule: "bg-destructive", accent: "text-destructive" },
  };

const LEAD: Record<VerificationVerdict["kind"], string> = {
  sah: "Diterbitkan oleh sekretariat Lembaga Ittihadul Muballighin melalui sistem penomoran surat resmi.",
  "tidak-berlaku":
    "Surat itu ditarik kembali oleh sekretariat. Yang tercatat di sistem hanya riwayat penerbitannya, bukan keberlakuannya.",
  "tidak-ditemukan":
    "Kemungkinan nomornya salah ketik, atau surat itu memang tidak diterbitkan melalui platform ini.",
};

interface VerifyLetterPageProps {
  params: Promise<{ kode: string[] }>;
}

/** Baris identitas; baris tanpa data hilang, bukan menampilkan tanda kosong. */
function row(label: string, value: string | null | undefined): Array<[string, string]> {
  return value ? [[label, value]] : [];
}

function signer(name: string | null, position: string | null): string | null {
  if (!name) return null;
  return position ? `${name} (${position})` : name;
}

export default async function VerifyLetterPage({
  params,
}: VerifyLetterPageProps) {
  const { kode: kodeSegments } = await params;
  const kode = decodeURIComponent(kodeSegments.join("/"));
  const verdict = classifyVerification(
    await getOutgoingMailByVerificationCode(kode),
  );

  const { kind } = verdict;
  const tone = TONE[kind];
  const letter = verdict.kind === "tidak-ditemukan" ? null : verdict.letter;

  const fullNumber = letter?.fullNumber ?? kode;
  const categoryLabel = LETTER_TYPES.find(
    (type) => type.key === letter?.categoryCode,
  )?.label;

  const rows: Array<[string, string]> = letter
    ? [
        ...row("Jenis Surat", categoryLabel),
        ["Perihal", letter.subject],
        ...row("Ditujukan kepada", letter.recipient),
        ["Tanggal surat", formatDateId(letter.mailDate, { long: true })],
        ...row(
          "Diterbitkan",
          letter.sentAt ? formatDateId(letter.sentAt, { long: true }) : null,
        ),
        ...row("Ketua", signer(letter.ketuaName, letter.ketuaPosition)),
        ...row(
          "Sekretaris",
          signer(letter.sekretarisName, letter.sekretarisPosition),
        ),
      ]
    : [];

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

        <div className={`mt-7 h-1 w-full rounded-full ${tone.rule}`} />

        <Reveal immediate className="mt-6">
          <h1 className="font-heading text-2xl font-semibold text-balance sm:text-[28px] sm:leading-snug">
            {kind === "tidak-ditemukan" ? (
              "Nomor surat ini tidak kami temukan."
            ) : (
              <>
                Surat{" "}
                <LetterPlate fullNumber={fullNumber} size="sm" className="align-middle" />{" "}
                {kind === "sah"
                  ? "sah dan masih berlaku."
                  : "pernah terbit, tetapi kini tidak berlaku."}
              </>
            )}
          </h1>

          <p className="mt-4 max-w-prose text-sm leading-6 text-muted-foreground">
            {LEAD[kind]}
          </p>

          {kind === "tidak-ditemukan" && (
            <p className={`mt-3 font-data text-xs ${tone.accent}`}>{kode}</p>
          )}
        </Reveal>

        {rows.length > 0 && (
          <Reveal delay={0.1} className="mt-9">
            <dl className="border-t border-border">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-1 gap-1 border-b border-border py-3 sm:grid-cols-[148px_1fr] sm:gap-4"
                >
                  <dt className="text-xs text-muted-foreground sm:text-sm">
                    {label}
                  </dt>
                  <dd className="min-w-0 wrap-break-word text-sm font-medium">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 max-w-prose text-xs leading-5 text-muted-foreground">
              Cocokkan nomor ini dengan nomor pada lembar surat yang Anda terima.
            </p>
          </Reveal>
        )}

        <Reveal
          delay={0.2}
          className="mt-10 border-t border-border pt-6"
        >
          <VerificationForm />
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <Stamp className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Butuh salinan resmi atau penjelasan atas surat ini?{" "}
              <Link
                href="/kontak"
                className="text-primary underline underline-offset-2"
              >
                Hubungi sekretariat
              </Link>
              .
            </span>
          </p>
          <p className="mt-6 flex items-center gap-1.5 font-data text-[11px] uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Sistem Verifikasi Surat LIM
          </p>
        </Reveal>
      </main>
    </div>
  );
}
