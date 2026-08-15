import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  FileText,
  Inbox,
  Send,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/admin/shared/section-card";
import { cn } from "@/lib/utils";

export interface DashboardDisposition {
  id: string;
  instruction: string;
  priority: string;
  status: string;
  dueDate: Date | null;
  incomingMail: {
    registrationNumber: string;
    subject: string;
  };
  assignedTo: { id: string; name: string } | null;
  overdue: boolean;
}

interface DashboardActionCounts {
  pendingDispositions: number;
  draftOutgoing: number;
  receivedIncoming: number;
  submittedDocuments: number;
}

interface ActionQueueProps {
  dispositions: DashboardDisposition[];
  counts: DashboardActionCounts;
}

const queueChips: Array<{
  label: string;
  href: string;
  icon: typeof ClipboardList;
  tone: string;
  getValue: (counts: DashboardActionCounts) => number;
}> = [
  {
    label: "Disposisi diproses",
    href: "/admin/secretariat/disposition/list",
    icon: ClipboardList,
    tone: "text-primary bg-primary/10",
    getValue: (c) => c.pendingDispositions,
  },
  {
    label: "Surat keluar draf",
    href: "/admin/secretariat/outgoing-mail/list?status=DRAFT",
    icon: Send,
    tone: "text-amber-600 bg-amber-100 dark:bg-amber-950/50",
    getValue: (c) => c.draftOutgoing,
  },
  {
    label: "Surat masuk baru",
    href: "/admin/secretariat/incoming-mail/list?status=RECEIVED",
    icon: Inbox,
    tone: "text-sky-600 bg-sky-100 dark:bg-sky-950/50",
    getValue: (c) => c.receivedIncoming,
  },
  {
    label: "Dokumen menunggu",
    href: "/admin/secretariat/document/list?status=SUBMITTED",
    icon: FileText,
    tone: "text-violet-600 bg-violet-100 dark:bg-violet-950/50",
    getValue: (c) => c.submittedDocuments,
  },
];

const priorityLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  LOW: { label: "Rendah", variant: "outline" },
  MEDIUM: { label: "Sedang", variant: "default" },
  HIGH: { label: "Tinggi", variant: "destructive" },
  URGENT: { label: "Mendesak", variant: "destructive" },
};

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PENDING: { label: "Menunggu", variant: "outline" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
};

function formatDueDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function ActionQueue({ dispositions, counts }: ActionQueueProps) {
  return (
    <SectionCard variant="glass">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Perlu Tindakan</h2>
          <p className="text-xs text-muted-foreground">
            Item yang menunggu tindak lanjut segera.
          </p>
        </div>
        <Badge variant="outline" className="h-6 px-2 text-[11px]">
          {counts.pendingDispositions} disposisi
        </Badge>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {queueChips.map((chip) => {
          const Icon = chip.icon;
          const value = chip.getValue(counts);
          return (
            <Link
              key={chip.href}
              href={chip.href}
              className="group flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md",
                  chip.tone,
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">
                  {chip.label}
                </p>
                <p className="text-lg font-semibold leading-tight">
                  {value.toLocaleString("id-ID")}
                </p>
              </div>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          Disposisi mendesak
        </p>
        {dispositions.length === 0 ? (
          <p className="rounded-md border border-dashed bg-background px-3 py-4 text-center text-xs text-muted-foreground">
            Tidak ada disposisi yang perlu ditindaklanjuti.
          </p>
        ) : (
          <ul className="divide-y rounded-md border bg-background">
            {dispositions.slice(0, 5).map((item) => {
              const priority = priorityLabels[item.priority] ?? {
                label: item.priority,
                variant: "outline" as const,
              };
              const status = statusLabels[item.status] ?? {
                label: item.status,
                variant: "outline" as const,
              };
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2.5 transition-colors",
                    item.overdue && "bg-destructive/5",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {item.overdue && (
                        <AlertTriangle className="size-3.5 shrink-0 text-destructive" />
                      )}
                      <Link
                        href={`/admin/secretariat/disposition/${item.id}/edit`}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {item.incomingMail.subject || item.instruction}
                      </Link>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                      <span className="font-mono">
                        {item.incomingMail.registrationNumber}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {item.assignedTo
                          ? item.assignedTo.name
                          : "Belum ditugaskan"}
                      </span>
                      <span aria-hidden>·</span>
                      <span
                        className={cn(
                          item.overdue && "font-medium text-destructive",
                        )}
                      >
                        Tenggat {formatDueDate(item.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge
                      variant={priority.variant}
                      className="h-5 px-2 text-[10px]"
                    >
                      {priority.label}
                    </Badge>
                    <Badge
                      variant={status.variant}
                      className="h-5 px-2 text-[10px]"
                    >
                      {status.label}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}
