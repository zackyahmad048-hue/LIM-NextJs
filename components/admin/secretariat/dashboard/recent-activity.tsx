import Link from "next/link";
import { ArrowRight, CalendarDays, Inbox, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/admin/shared/section-card";
import { cn } from "@/lib/utils";

export interface RecentOutgoingMail {
  id: string;
  registrationNumber: string;
  subject: string;
  status: string;
  mailDate: Date;
}

export interface RecentIncomingMail {
  id: string;
  registrationNumber: string;
  sender: string;
  subject: string;
  status: string;
  receivedDate: Date;
}

export interface UpcomingAgenda {
  id: string;
  title: string;
  date: Date;
  location: string | null;
}

interface RecentActivityProps {
  outgoing: RecentOutgoingMail[];
  incoming: RecentIncomingMail[];
  agendas: UpcomingAgenda[];
}

const outgoingStatusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Terkirim", variant: "default" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

const incomingStatusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  RECEIVED: { label: "Diterima", variant: "default" },
  PROCESSED: { label: "Diproses", variant: "secondary" },
  ARCHIVED: { label: "Diarsipkan", variant: "outline" },
};

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function RecentActivity({
  outgoing,
  incoming,
  agendas,
}: RecentActivityProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <ActivityCard
        title="Surat Keluar"
        icon={Send}
        tone="text-amber-600 bg-amber-100 dark:bg-amber-950/50"
        viewAllHref="/admin/secretariat/outgoing-mail/list"
        empty="Belum ada surat keluar."
      >
        {outgoing.map((item) => {
          const status = outgoingStatusLabels[item.status] ?? {
            label: item.status,
            variant: "outline" as const,
          };
          return (
            <li key={item.id}>
              <Link
                href={`/admin/secretariat/outgoing-mail/${item.id}/edit`}
                className="group flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:underline">
                    {item.subject}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{item.registrationNumber}</span>
                    {" · "}
                    {formatShortDate(item.mailDate)}
                  </p>
                </div>
                <Badge
                  variant={status.variant}
                  className="h-5 shrink-0 px-2 text-[10px]"
                >
                  {status.label}
                </Badge>
              </Link>
            </li>
          );
        })}
      </ActivityCard>

      <ActivityCard
        title="Surat Masuk"
        icon={Inbox}
        tone="text-sky-600 bg-sky-100 dark:bg-sky-950/50"
        viewAllHref="/admin/secretariat/incoming-mail/list"
        empty="Belum ada surat masuk."
      >
        {incoming.map((item) => {
          const status = incomingStatusLabels[item.status] ?? {
            label: item.status,
            variant: "outline" as const,
          };
          return (
            <li key={item.id}>
              <Link
                href={`/admin/secretariat/incoming-mail/${item.id}/edit`}
                className="group flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:underline">
                    {item.subject}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    <span className="font-mono">{item.registrationNumber}</span>
                    {" · "}
                    {item.sender}
                  </p>
                </div>
                <Badge
                  variant={status.variant}
                  className="h-5 shrink-0 px-2 text-[10px]"
                >
                  {status.label}
                </Badge>
              </Link>
            </li>
          );
        })}
      </ActivityCard>

      <ActivityCard
        title="Agenda Mendatang"
        icon={CalendarDays}
        tone="text-violet-600 bg-violet-100 dark:bg-violet-950/50"
        viewAllHref="/admin/secretariat/agenda"
        empty="Tidak ada agenda mendatang."
      >
        {agendas.map((item) => (
          <li key={item.id}>
            <Link
              href={`/admin/secretariat/agenda/${item.id}/edit`}
              className="group flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex size-9 shrink-0 flex-col items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                <span className="text-[10px] font-medium uppercase leading-none">
                  {new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
                    item.date,
                  )}
                </span>
                <span className="mt-0.5 text-sm font-bold leading-none">
                  {item.date.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium group-hover:underline">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {formatLongDate(item.date)}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ActivityCard>
    </div>
  );
}

interface ActivityCardProps {
  title: string;
  icon: typeof Send;
  tone: string;
  viewAllHref: string;
  empty: string;
  children: React.ReactNode;
}

function ActivityCard({
  title,
  icon: Icon,
  tone,
  viewAllHref,
  empty,
  children,
}: ActivityCardProps) {
  const hasItems = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              tone,
            )}
          >
            <Icon className="size-3.5" />
          </span>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Lihat semua
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <ul className="mt-3 -mx-3 divide-y rounded-md border bg-background">
        {hasItems ? (
          children
        ) : (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">
            {empty}
          </li>
        )}
      </ul>
    </SectionCard>
  );
}
