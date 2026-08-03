import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/website/page-header";
import SectionLabel from "@/components/shared/section-label";
import { HubDot } from "@/components/shared/hub-dot";
import { BIDANG } from "@/config/bidang";

export const metadata: Metadata = {
  title: "Tim Wajib Khidmah | LIM Digital Platform",
  description:
    "Tim Wajib Khidmah merupakan penugasan anggota LIM untuk melayani kegiatan dan kebutuhan organisasi selama masa khidmah.",
};

export default function TimWajibKhidmahPage() {
  const lainnya = BIDANG.filter((item) => item.slug !== "tim-wajib-khidmah");

  return (
    <>
      <PageHeader
        title="Tim Wajib Khidmah"
        description="Penugasan anggota LIM untuk melayani kegiatan dan kebutuhan organisasi selama masa khidmah."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Peran dan Tugas</SectionLabel>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Menjadi panitia maupun petugas dalam kegiatan organisasi.
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Melaksanakan penugasan rutin yang ditetapkan oleh pengurus.
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Mendukung pelayanan di tempat-tempat kegiatan sesuai pos
                Wajib Khidmah yang ditugaskan.
              </li>
              <li className="flex items-start gap-3">
                <HubDot className="mt-1.5 h-2.5 w-2.5" />
                Menjaga amanah, kedisiplinan, dan ketertiban selama masa
                khidmah.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Data Anggota</SectionLabel>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Daftar anggota Wajib Khidmah bersifat internal dan dikelola
              melalui sistem administratif organisasi. Informasi terkait
              penugasan dapat dikonfirmasi langsung kepada pengurus.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <SectionLabel>Bidang Lainnya</SectionLabel>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {lainnya.map((item) => (
                <Link
                  key={item.slug}
                  href={`/profil/bidang/${item.slug}`}
                  className="group rounded-xl border border-primary/10 bg-muted/40 p-4 transition-colors hover:border-primary/40 hover:bg-muted/70"
                >
                  <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
