import type { Metadata } from "next";
import PageHeader from "@/components/website/page-header";
import { HubDot } from "@/components/shared/hub-dot";
import { getTentangContent } from "@/modules/cms/queries/site-page.query";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tentang LIM | LIM Digital Platform",
  description:
    "Mengenal lebih dekat Lembaga Ittihadul Muballighin sebagai organisasi dakwah.",
};

export default async function TentangPage() {
  const tentang = await getTentangContent();
  const sejarah = tentang.sejarah
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        title={tentang.headerTitle}
        description={tentang.headerDescription}
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8">
          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-balance text-foreground">
              Sejarah
            </h3>
            {sejarah.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-balance text-foreground">
              Keunggulan
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {tentang.keunggulan.map((item) => (
                <div key={item.title} className="rounded-xl bg-muted/50 p-5">
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-card p-7 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-balance text-foreground">
              Tujuan
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              {tentang.tujuan.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <HubDot className="mt-1.5 h-2.5 w-2.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}