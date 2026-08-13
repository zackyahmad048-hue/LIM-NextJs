import { cn } from "@/lib/utils";

type HubDotProps = {
  className?: string;
  pulse?: boolean;
};

export function HubDot({ className, pulse = false }: HubDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-3 w-3 shrink-0 items-center justify-center",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full border border-dashed border-primary/70" />
      <span
        className={cn(
          "h-1/2 w-1/2 rounded-full bg-primary",
          pulse && "animate-pulse motion-reduce:animate-none",
        )}
      />
    </span>
  );
}
