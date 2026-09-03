import { cn } from "@/lib/utils";
import Reveal from "@/components/website/motion/reveal";

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
        <Reveal>
          <h1
            className={cn(
              "max-w-3xl font-heading text-[2rem] font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-4xl md:text-5xl",
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
        </Reveal>

        {children && (
          <Reveal delay={0.12}>
            <div className="mt-8">{children}</div>
          </Reveal>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal from="scale" delay={0.08}>
          <div className="h-px bg-border" aria-hidden />
        </Reveal>
      </div>
    </header>
  );
}
