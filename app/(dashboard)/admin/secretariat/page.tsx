import Link from "next/link";
import { Inbox, Send, ArrowRight } from "lucide-react";

import { PageContainer } from "@/components/admin/shared/page-container";
import { PageHeader } from "@/components/admin/shared/page-header";

import { getSecretariatStats } from "@/modules/secretariat/queries/secretariat.query";

export default async function SecretariatDashboardPage() {
  const stats = await getSecretariatStats();

  const cards = [
    {
      title: "Surat Masuk",
      description: "Kelola surat masuk organisasi.",
      value: stats.totalIncomingMails,
      href: "/admin/secretariat/surat?tab=masuk",
      icon: Inbox,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Surat Keluar",
      description: "Kelola surat keluar organisasi.",
      value: stats.totalOutgoingMails,
      href: "/admin/secretariat/surat?tab=keluar",
      icon: Send,
      color: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Sekretariat"
        description="Pengelolaan surat-menyurat organisasi."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${card.color}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-card-foreground">
                    {card.title}
                  </h2>
                  <span className="text-lg font-bold text-primary">
                    {card.value}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
