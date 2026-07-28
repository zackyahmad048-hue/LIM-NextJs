import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";

export default function KontakPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          badge="Kontak"
          title="Hubungi Kami"
          description="Silakan hubungi kami untuk informasi lebih lanjut."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Alamat",
              value:
                "Gedung Al Ittihad Lt.1\nPondok Pesantren Lirboyo, Kediri",
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
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/30">
                <item.icon size={20} className="text-orange-500" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-card-foreground">
                {item.title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
