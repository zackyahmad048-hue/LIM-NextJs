import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  centered?: boolean;
}

export default function PageHeader({
  title,
  description,
  children,
  centered = false,
}: PageHeaderProps) {
  return (
    <header className="relative">
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20",
          centered && "text-center",
        )}
      >
        <h1
          className={cn(
            "max-w-3xl font-display text-[2rem] font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-4xl md:text-5xl",
            centered && "mx-auto",
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-7 text-pretty text-muted-foreground md:text-lg",
              centered && "mx-auto",
            )}
          >
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="h-px bg-border" aria-hidden />
      </div>
    </header>
  );
}