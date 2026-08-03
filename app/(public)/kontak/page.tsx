import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import PageHeader from "@/components/website/page-header";
import WhatsAppForm from "@/components/website/kontak/whatsapp-form";
import SectionLabel from "@/components/shared/section-label";

export const metadata: Metadata = {
  title: "Hubungi Kami | LIM Digital Platform",
  description:
    "Hubungi Lembaga Ittihadul Muballighin untuk informasi lebih lanjut.",
};

const contacts = [
  {
    icon: MapPin,
    title: "Alamat",
    value: "Gedung Al Ittihad Lt.1\nPondok Pesantren Lirboyo, Kediri",
  },
  {
    icon: Phone,
    title: "Telepon",
    value: "+62 813-6789-1910",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@ittihadulmuballighin.or.id",
  },
];

export default function KontakPage() {
  return (
    <>
      <PageHeader
        title="Hubungi Kami"
        description="Silakan hubungi kami untuk informasi lebih lanjut."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {contacts.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-primary/15 bg-card p-6 text-center transition-colors hover:border-primary/40"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <item.icon size={18} className="text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle size={18} />
            <SectionLabel>Kirim Pesan</SectionLabel>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Isi formulir di bawah untuk mengirim pesan langsung ke WhatsApp
            Sekretariat LIM.
          </p>
          <div className="mt-6">
            <WhatsAppForm />
          </div>
        </div>
      </section>
    </>
  );
}
