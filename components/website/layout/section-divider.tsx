import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
}

export default function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn("mx-auto max-w-6xl px-4 sm:px-6", className)}>
      <div className="h-px bg-border/60" aria-hidden />
    </div>
  );
}
