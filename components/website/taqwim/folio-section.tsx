import { cn } from "@/lib/utils";

interface FolioSectionProps {
  arabic?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function FolioSection({
  arabic,
  label,
  children,
  className,
  contentClassName,
}: FolioSectionProps) {
  return (
    <section className={cn("relative", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Brow — mobile only */}
        <div aria-hidden className="flex items-center gap-3 pb-5 pt-6 lg:hidden">
          {arabic && (
            <span className="font-ar text-sm leading-none text-primary">{arabic}</span>
          )}
          <span className="font-sans text-[10px] font-medium uppercase text-muted-foreground">
            {label}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="lg:grid lg:grid-cols-[9rem_1fr] lg:gap-8">
          {/* Margin rule — desktop only */}
          <aside aria-hidden className="hidden lg:block">
            <div className="flex h-full flex-col items-start">
              {arabic && (
                <span className="font-ar text-base leading-none text-primary">{arabic}</span>
              )}
              <span className="mt-3 font-sans text-[10px] font-medium uppercase text-muted-foreground">
                {label}
              </span>
              <span className="mt-6 w-px flex-1 self-stretch bg-border" />
            </div>
          </aside>

          <div className={contentClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}